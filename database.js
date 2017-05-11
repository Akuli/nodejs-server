var mongoose = require('mongoose');
var utils = require('./utils.js');


mongoose.connect('mongodb://localhost/servertest')
mongoose.connection.on('error', function(msg) {
  console.error("cannot connect the database: " + msg);
  process.exit(1);
});
mongoose.connection.once('open', function() {
  console.log("database is ready");
});


var playerDefinition = {
  /* mongoose adds _id here */
  name: String,
  email: String,
  settings: {
    language: String,
    difficulty: Number
  },
  score: Number
};
var Player = mongoose.model('Player', mongoose.Schema(playerDefinition));


exports.addPlayer = function(playerInfo, doneCallback) {
  if (!utils.sameKeys(playerDefinition, playerInfo)) {
    doneCallback("players need to have these keys: "
                 + Object.keys(playerDefinition));
    return;
  }

  var player = new Player(playerInfo);
  player.save(function(err, player) {
    if (err) {
      doneCallback(err, null);
      return;
    }
    doneCallback(null, player._id);
  });
}


exports.getPlayer = function(id, doneCallback) {
  Player.findById(id, function(err, player) {
    if (err) {
      doneCallback(err, null);
      return;
    }
    if (player == null) {
      doneCallback("player not found", null);
      return;
    }

    /* the player has a __v key here for some reason, other mongoose
       versions might put other weird keys there too */
    var result = { };
    var keys = Object.keys(playerDefinition);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = player[keys[i]];
    }
    doneCallback(null, result);
  });
}


exports.deletePlayer = function(id, doneCallback) {
  Player.remove({ _id: id }, function(error, writeOpResult) {
    if (!error && writeOpResult.result.n == 0) {
      doneCallback("player not found");
    } else {
      doneCallback(null);
    }
  });
}


exports.updatePlayerInfo = function(id, info, doneCallback) {
  var newInfo = {}
  var keys = Object.keys(info);

  exports.getPlayer(id, function(err, oldInfo) {
    if (err) {
      doneCallback(err);
      return;
    }

    if (oldInfo == null) {
      doneCallback("player not found");
      return;
    }

    for (var i = 0; i < keys.length; i++) {
      // TODO: add support for [] objects later if needed
      var key = keys[i];
      if (typeof oldInfo[key] == 'object') {
        newInfo[key] = {};
        utils.update(newInfo[key], oldInfo[key]);
        utils.update(newInfo[key], info[key]);
      } else {
        newInfo[key] = info[key];
      }
    }

    Player.update({_id: id}, newInfo, function(err, rawResponse) {
      doneCallback(err);
    });
  });
}
