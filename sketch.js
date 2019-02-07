
// TODO: Make things update in other tabs (on user join)
// movement
// firing

var database, ref;

var ship; // ship image
var ships = []; // array of all ships
var stars = []; // array of all stars
var userNum = -1;

var inf = {}; // game info

var kp = [];
function keyPressed() {
  kp[keyCode] = true;
}
function keyReleased() {
  kp[keyCode] = false;
}

function Ship(dataRef) {
  this.dataRef = dataRef.toString();
  this.draw = function() {
    push();
    var dist = (new Date().getTime() - inf.ships[this.dataRef].last) / 1000 * 0.5;
    translate((inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist) * window.innerWidth, (inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist) * window.innerHeight);
    rotate(inf.ships[this.dataRef].rot);
    image(ship, 0, 0, 17 * 5, 18 * 5);
    pop();
  }
  this.update = function() {
    var dist = (new Date().getTime() - inf.ships[this.dataRef].last) / 1000 * 0.5;
    if (kp[39]) {
      ref.game.child("ships").child(this.dataRef).child("x").set(inf.ships[this.dataRef].x + sin(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("y").set(inf.ships[this.dataRef].y - cos(inf.ships[this.dataRef].rot) * dist);
      ref.game.child("ships").child(this.dataRef).child("rot").set(inf.ships[this.dataRef].rot + 0.1);
      ref.game.child("ships").child(this.dataRef).child("last").set(new Date().getTime());
    }
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

  var shipPallet = [
    color(0, 0, 0, 0),
    color(50, 50, 50),
    color(255, 255, 255),
    color(225, 50, 50),
    color(50, 200, 255)
  ],
  // color(50, 200, 255)
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
  background(0);
  stroke(255);
  for(var i = 0; i < stars.length; i++) {
    strokeWeight((sin(frameCount / 100 + stars[i].offset) + 1) * 2);
    point(stars[i].x, stars[i].y);
  }
  strokeWeight(1);
  for (var i = 0; i < ships.length; i++) {
    if (inf !== null && inf.ships[i] !== undefined) {
      ships[i].draw();
    }
  }
  if (userNum !== -1) {
    ships[userNum].update();
  }
}
