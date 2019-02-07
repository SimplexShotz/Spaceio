
var database, ref;

var ship;

var inf = {};

function setup() {
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

  ref.game.once("value", function(data) {
    var d = data.val();
    inf = d;
  });

  var shipPallet = [
    color(0, 0, 0, 0),
    color(0, 0, 0),
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
}

function Ship(dataRef) {
  this.dataRef = dataRef;
  this.draw = function() {

  }
}

var stars = [];
for (var i = 0; i < 250; i++) {
  stars.push({
    x: random(window.innerWidth),
    y: random(window.innerHeight)
  });
}
function draw() {
  background(50);
  stroke(255);
  for(var i = 0; i < stars.length; i++) {
    point(stars[i].x, stars[i].y);
  }
  image(ship, 20, 20, 17 * 5, 18 * 5);
}
