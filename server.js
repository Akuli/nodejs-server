var http = require('http');
var database = require('./database.js')
var utils = require('./utils.js')


function receiveJSON(request, doneCallback) {
  var body = [];
  request.on('data', function(chunk) {
    body.push(chunk);
  });
  request.on('end', function() {
    doneCallback(JSON.parse(Buffer.concat(body).toString()));
  });
  request.on('error', function(err) {
    /* we probably can't send the error info back to the client anyway
       so no need to handle it in a nicer way */
    console.error(err.stack);
  });
}


function handleRequest(request, response) {
  console.log(request.method + " " + request.url);
  request.on('error', function(err) {
    console.error("error in request: " + err);
  });

  function error(message) {
    // TODO: use different status codes instead of always using 200 or 400?
    console.error(message.toString());
    response.writeHead(400);    // 400 means bad request
    response.end(message.toString());
  }

  var url = request.url;
  if (url == '/api/player') {
    url += '/';
  } else if (!utils.startsWith(url, '/api/player/')) {
    response.writeHead(404);
    response.end();
    return;
  }

  var idString = url.slice('/api/player/'.length);
  if (request.method == "GET" || request.method == "DELETE") {
    // only these need an ID in the URL
    if (idString.length == 0) {
      error("the URL should be /api/player/:id");
      return;
    }
  } else if (idString.length != 0) {
    error("the URL should be /api/player");
    return;
  }

  switch (request.method) {
    case "GET":
      // return info about an existing player as JSON
      database.getPlayer(idString, function(err, player) {
        if (err) {
          error(err);
          return;
        }
        player._id = idString;
        response.end(JSON.stringify(player));
      });
      break;

    case "POST":
      // add a new player, return ID
      receiveJSON(request, function(playerInfo) {
        database.addPlayer(playerInfo, function(err, id) {
          if (err) {
            error(err);
          } else {
            response.end(id.toString());
          }
        });
      });
      break;

    case "DELETE":
      // get rid of a player
      database.deletePlayer(idString, function(err) {
        if (err) {
          error(err);
        } else {
          response.end();
        }
      });
      break;

    case "PUT":
      // update information about an existing player
      receiveJSON(request, function(playerInfo) {
        theId = playerInfo._id;
        if (theId === undefined) {
          error("_id must be specified in the JSON");
          return;
        }
        delete playerInfo._id;
        database.updatePlayerInfo(theId, playerInfo, function(err) {
          if (err) {
            error(err);
          } else {
            response.end();
          }
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
    console.error("server cannot listen: " + err);
    process.exit(1);
  }
  console.log("server listening on port 9999");
});
