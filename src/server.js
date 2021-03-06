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

var resolution = {width: 1, height: 1};

app.set('view engine', 'ejs')

//const validLocations = ["1","2","3"];

var seat_map = [];

function validateLocation(location) {
  for (var j = 0; j < seat_map.length; j++){
    var col = seat_map[j].findIndex((element) => {
      console.log(element);
      return element == location;
    });
    if (col != -1)
    return [j,col];
  }
  return [];
}

function getVideoDimensions() {
  return {
    width: seat_map[0].length * resolution.width,
    height: seat_map.length * resolution.height
  };
}

// Client Routes

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {


  var check_valid = validateLocation(req.body.location);
  if (typeof video !== undefined && typeof check_valid != "undefined" && check_valid != null && check_valid.length != null && check_valid.length > 0){
    var colorsList = [];
    for (var k = parseInt(check_valid[0])*parseInt(resolution.height); k < parseInt(check_valid[0]) * parseInt(resolution.height) + parseInt(resolution.height); k++) {
      var list = [];
      for (var p = parseInt(check_valid[1])*parseInt(resolution.width); p < parseInt(check_valid[1])*parseInt(resolution.width)+parseInt(resolution.width); p++) {
        list.push(video[k][p]);
      }
      colorsList.push(list);
    }


    res.render('display', {location: req.body.location, colors: colorsList, width: resolution.width, height: resolution.height} );
  }
  else {
    res.render('index', {error: true})
  }
});

// Administration Routes

app.get('/admin', (req, res) => {
  res.render('admin', {
    resWidth: resolution.width, resHeight: resolution.height});
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
    var dimensions = getVideoDimensions();
    var spawn = require('child_process').spawn,
    py = spawn('python', ['./scripts/videoToJson.py', './assets/video.mp4', dimensions.height, dimensions.width,]),
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
    res.json(Object.keys(io.sockets.sockets).length);
  });

  app.post('/importMap', (req, res) => {
    seat_map = [];
    const csvFilePath='./assets/map.csv'
    csv({noheader:true})
    .fromFile(csvFilePath)
    .on('csv',(csvRow, rowIndex)=>{ // this func will be called 3 times

      if (typeof csvRow !== "undefined" && csvRow !== null && csvRow.length !== null && csvRow.length > 0) {
        seat_map.push([]);
        for (var j = 0; j < csvRow.length; j++){
          seat_map[rowIndex][j] = csvRow[j];
        }
      }
    })
    .on('done',(error)=>{
      while (seat_map[seat_map.length-1].length == 0){
        seat_map.splice(-1,1);
      }
    })

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
