'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const csv = require('csvtojson');

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

const video = require('./video.json') || undefined;

let resolution = {width: 1, height: 1};
let map = {width: 4, height: 4};

app.set('view engine', 'ejs')

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
  if (typeof video !== undefined && validateLocation(req.body.location)) {
    res.render('display', {location: req.body.location, colors: video[20][30] } );
  }
  else {
    res.render('index', {error: true})
  }
});

// Administration Routes

app.get('/admin', (req, res) => {
  console.log(io.sockets.sockets);
  res.render('admin', {
    resWidth: resolution.width, resHeight: resolution.height,
    mapWidth: map.width, mapHeight: map.height});
});

function futureEventTime(seconds) {
  var t = new Date(Date.now());
  t.setSeconds(t.getSeconds() + seconds);
  return t;
}

app.get('/start', (req, res) => {
  console.log("Broadcasting start")
  io.emit('start', {time: futureEventTime(5)});
});

app.get('/stop', (req, res) => {
  console.log("Broadcasting stop")
  io.emit('stop', {time: futureEventTime(0)});
});

app.post('/processVideo', (req, res) => {
  var spawn = require('child_process').spawn,
      py = spawn('python', ['./scripts/videoToJson.py', './assets/video.mp4', 48, 36]),
      string = "";

  py.stdout.on('data', function(data){
    string += data.toString();
    console.log(string);
  });

  py.stderr.on('data', function(data){
    console.log(data.toString());
  });

  py.stdout.on('end', function(){
    console.log(string);
  });

  res.redirect('/admin');
});

app.get('/clients', (req, res) => {
  res.json(Object.keys(io.sockets.sockets));
});

app.post('/importMap', (req, res) => {
  csv({noheader:true})
    .fromString(csvStr)
    .on('csv',(csvRow)=>{ // this func will be called 3 times
        console.log(csvRow) // => [1,2,3] , [4,5,6]  , [7,8,9]
    })
    .on('done',()=>{
        //parsing finished
    });
    res.redirect('/admin');
});




app.post('/setResolution', (req, res) => {
  resolution.width = req.body.w;
  resolution.height = req.body.h;
  res.redirect('/admin');
});
// handle timesync requests
app.use('/timesync', timesyncServer.requestHandler);

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});
