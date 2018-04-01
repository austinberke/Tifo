'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var timesyncServer = require('timesync/server');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// Constants
const PORT = process.env.NODE_PORT || 8080;

app.set('view engine', 'ejs')

// Functions
var spawn = require('child_process').spawn,
    py = spawn('python', ['./scripts/videoToJson.py', '../media/video.mp4', 48, 36]),
    string = "";

py.stdout.on('data', function(data){
  string += data.toString();
  console.log(string);
});

py.stdout.on('end', function(){
  console.log(string);
});



const validLocations = ["1","2","3"];

function validateLocation(location) {
  return validLocations.includes(location);
}

function getColors() {

}

// Client Routes

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  if (validateLocation(req.body.location)) {
    res.render('display', {location: req.body.location, colors: ['green','blue']} );
  }
  else {
    res.render('index', {error: true})
  }
});

// Administration Routes

app.get('/admin', (req, res) => {
  console.log(io.sockets.sockets);
  res.render('admin', {clients: Object.keys(io.sockets.sockets).length });
});

function futureEventTime(seconds) {
  var t = new Date(Date.now());
  t.setSeconds(t.getSeconds() + seconds);
  return t;
}

app.get('/start', (req, res) => {
  console.log("Broadcasting start")
  io.emit('start', {time: futureEventTime(2)});
});

app.get('/stop', (req, res) => {
  console.log("Broadcasting stop")
  io.emit('stop', {time: futureEventTime(0)});
});

io.on('connection', function(socket){
  console.log('a user connected');
});

// handle timesync requests
app.use('/timesync', timesyncServer.requestHandler);

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});
