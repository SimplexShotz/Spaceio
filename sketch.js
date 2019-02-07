
var database, ref;

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
}
var stars = [];

for (var i = 0; i < 250; i++) {
  stars.push({x: random(window.innerWidth),y: random(window.innerHeight)});
}
function draw() {
  background(50);
  stroke(255)
  for(var I = 0; I < stars.length; I++) {
    point(stars[I].x,stars[I].y);
  }


}
