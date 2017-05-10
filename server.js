var http = require('http');
var database = require('./database.js')


// String.startsWith doesn't work for some reason :(
function startsWith(string, substring) {
  return string.slice(0, substring.length) == substring;
}


function receiveString(request, doneCallback) {
  var body = [];
  request.on('data', function(chunk) {
    body.push(chunk);
  });
  request.on('end', function() {
    doneCallback(Buffer.concat(body).toString());
  });
  request.on('error', function(err) {
    console.error(err.stack);
  });
}


function handleRequest(request, response) {
  console.log(request.method + " " + request.url);

  request.on('error', function(err) {
    console.error(err);
  });

  function error(message) {
    console.warn(message);
    // TODO: use an approppriate HTTP status code
    response.end(JSON.stringify({error: message.toString()}));
  }

  var url = request.url;
  if (url == '/api/player') {
    url += '/';
  } else if (!startsWith(url, '/api/player/')) {
    error("expected a connection to '/api/player/', not " + url);
    return;
  }

  var idString = url.slice('/api/player/'.length);

  switch (request.method) {
    case "GET":
      if (idString.length == 0) {
        error("the URL should be /api/player/:id");
        return;
      }

      database.getPlayer(idString, function(err, player) {
        if (err) {
          error(err.toString());
          return;
        }
        response.end(JSON.stringify(player));
      });
      break;

    case "POST":
      var data = receiveString(request, function(received) {
        console.log('wololo ' + received);
        var playerInfo = JSON.parse(received);
        console.log('wololo 2 ' + received);
        database.addPlayer(playerInfo, function(err, id) {
          if (err) { error(err); } else { response.end(id.toString()); }
        });
      });
      break;

    default:
      error("don't know how to handle " + request.method + " requests");
      break;
  }
}


var server = http.createServer(handleRequest);


server.listen(9999, function(err) {
  if (err) {
    console.error("something went wrong: " + err);
    process.exit(1);
  } else {
    console.log("server listening on port 9999");
  }
});

server.on('connect', function(request, socket, head) {
  console.log("connected");
});
