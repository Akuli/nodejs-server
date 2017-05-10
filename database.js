var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/servertest')
mongoose.connection.on('error', function(msg) {
  console.error("cannot connect the database: " + msg);
  process.exit(1);
});
mongoose.connection.once('open', function() {
  console.log("database is ready");
});


function sameKeys(obj1, obj2) {
  return JSON.stringify(Object.keys(obj1).sort())
      == JSON.stringify(Object.keys(obj2).sort());
}


var playerDefinition = {
  name: String
};
var Player = mongoose.model('Player', mongoose.Schema(playerDefinition));


function addPlayer(playerInfo, doneCallback) {
  if (!sameKeys(playerDefinition, playerInfo)) {
    doneCallback("players need to have these keys: "
                 + Object.keys(playerSchema));
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


function getPlayer(id, doneCallback) {
  Player.findById(id, function(err, player) {
    if (err) {
      doneCallback(err, null);
      return;
    }

    // the player has a __v key here for some reason
    var result = { };
    keys = Object.keys(playerDefinition);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = player[keys[i]];
    }
    doneCallback(null, result);
  });
}


module.exports.addPlayer = addPlayer;
module.exports.getPlayer = getPlayer;
