
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

function draw() {
  background(50);
}
