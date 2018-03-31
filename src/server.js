'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var timesyncServer = require('timesync/server');

// Constants
const PORT = process.env.NODE_PORT || 8080;

// App

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/display', (req, res) => {
  res.render('display', {colors: ['green','blue']} );
});

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
