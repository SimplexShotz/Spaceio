
// TODO: Make things update in other tabs (on user join)
// firing

// Firebase variables
var database, ref;

var ship; // The ships' images
var ships = []; // Array of all ships
var stars = []; // Array of all stars
var userNum = -1; // This user's dataRef value

var inf = {}; // Game info

// Key input
var kp = [];
function keyPressed() {
  kp[keyCode] = true;
}
function keyReleased() {
  kp[keyCode] = false;
}

// Ship object
function Ship(dataRef) {
  // Store the dataRef
  this.dataRef = dataRef.toString();
  // Draws the ship
  this.draw = function() {
    // Moves and orientates the image
    push();
    var dist = (new Date().getTime() - inf.ships[this.dataRef].last) / 1000 * 0.5;
    translate((inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist) * window.innerWidth, (inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist) * window.innerHeight);
    rotate(inf.ships[this.dataRef].rot);
    // Draws the image
    image(ship, 0, 0, 17 * 5, 18 * 5);
    // Resets the movements and orientations
    pop();
  }
  // Updates the ship (only called for this ship by this user)
  this.update = function() {
    var o = 0.04;
    // Get the distance since the user last turned
    var dist = (new Date().getTime() - inf.ships[this.dataRef].last) / 1000 * 0.5;
    // Warping code (from one side to the other)
    if (inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist < -o) {
      ref.game.child("ships").child(this.dataRef).child("x").set(inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist + (1 + o * 2));
      ref.game.child("ships").child(this.dataRef).child("y").set(inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("last").set(new Date().getTime());
    } else if (inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist > 1 + o) {
      ref.game.child("ships").child(this.dataRef).child("x").set(inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist - (1 + o * 2));
      ref.game.child("ships").child(this.dataRef).child("y").set(inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("last").set(new Date().getTime());
    } else if (inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist < -o) {
      ref.game.child("ships").child(this.dataRef).child("x").set(inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("y").set(inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist + (1 + o * 2));
      ref.game.child("ships").child(this.dataRef).child("last").set(new Date().getTime());
    } else if (inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist > 1 + o) {
      ref.game.child("ships").child(this.dataRef).child("x").set(inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("y").set(inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist - (1 + o * 2));
      ref.game.child("ships").child(this.dataRef).child("last").set(new Date().getTime());
    }
    // Turning
    // Right
    if (kp[39]) {
      ref.game.child("ships").child(this.dataRef).child("x").set(inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("y").set(inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("rot").set(inf.ships[this.dataRef].rot + 0.1);
      ref.game.child("ships").child(this.dataRef).child("last").set(new Date().getTime());
    }
    // Left
    if (kp[37]) {
      ref.game.child("ships").child(this.dataRef).child("x").set(inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("y").set(inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("rot").set(inf.ships[this.dataRef].rot - 0.1);
      ref.game.child("ships").child(this.dataRef).child("last").set(new Date().getTime());
    }
  }
}

async function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // Firebase setup
  var config = {
    apiKey: "AIzaSyBRi2IbqvHVNNqYdZZ4G7kWIfwLydehd8I",
    authDomain: "spaceio.firebaseapp.com",
    databaseURL: "https://spaceio.firebaseio.com",
    projectId: "spaceio",
    storageBucket: "spaceio.appspot.com",
    messagingSenderId: "617144049210"
  };
  firebase.initializeApp(config);
  database = firebase.database();
  ref = {
    game: database.ref("game")
  };

  ref.game.on("value", function(data) {
    var d = data.val();
    // ship handling:
    inf = d;
  });

  await ref.game.once("value", function(data) {
    var d = data.val();
    var max = -1;
    if (d !== null) {
      for (var i in d.ships) {
        if (Number(i) > max) {
          max = Number(i);
        }
      }
    }
    ref.game.child("ships").child(max + 1).set({
      x: random(0.2, 0.8),
      y: random(0.2, 0.8),
      rot: random(360),
      last: new Date().getTime()
    });
    if (d !== null) {
      for (var i in d.ships) {
        ships.push(new Ship(i));
      }
    }
    ships.push(new Ship(max + 1));
    userNum = max + 1;
  });

  // Ship pallet and bitmap
  var shipPallet = [
    color(0, 0, 0, 0),
    color(50, 50, 50),
    color(255, 255, 255),
    color(225, 50, 50),
    color(50, 200, 255)
  ],
  shipMap = [
    "00000001110000000",
    "00000001410000000",
    "00000001110000000",
    "00000001210000000",
    "00000011211000000",
    "00000012221000000",
    "00011112221111000",
    "00013112221131000",
    "00012122222121000",
    "11112422322421111",
    "13114223332241131",
    "12112223232221121",
    "12122222222222121",
    "12222232223222221",
    "12221332223312221",
    "12211331213311221",
    "12111111211111121",
    "11100001110000111"
  ];

  // Ship image
  var g = createGraphics(17 * 5, 18 * 5, P2D);
  g.noStroke();
  for (var i = 0; i < shipMap[0].length; i++) {
    for (var j = 0; j < shipMap.length; j++) {
      g.fill(shipPallet[shipMap[j][i]]);
      g.rect(i * 5, j * 5, 5, 5);
    }
  }
  ship = g;
  imageMode(CENTER);

  // Stars setup
  for (var i = 0; i < 250; i++) {
    stars.push({
      x: random(window.innerWidth),
      y: random(window.innerHeight),
      offset: random(10000)
    });
  }
}

function draw() {
  cursor();
  // Background
  background(0);
  stroke(255);
  for(var i = 0; i < stars.length; i++) {
    strokeWeight((sin(frameCount / 100 + stars[i].offset) + 1) * 2);
    point(stars[i].x, stars[i].y);
  }
  strokeWeight(1);
  // Remove inactive ships
  for (var i = 0; i < ships.length; i++) {
    if (inf !== null && inf.ships[i] !== undefined) {
      if (new Date().getTime() - inf.ships[i].last > 120000) {
        ref.game.child("ships").child(i).remove();
      }
    }
  }
  // Draw all the ships
  for (var i = 0; i < ships.length; i++) {
    if (inf !== null && inf.ships[i] !== undefined) {
      ships[i].draw();
    }
  }
  // Update this user's ship
  if (inf !== null && inf.ships[userNum] !== undefined && userNum !== -1) {
    ships[userNum].update();
  }
}
