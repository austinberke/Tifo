'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Constants
const PORT = 8080;

// App

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/start', (req, res) => {
  res.render('start');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(PORT, function(){
  console.log('listening on *:8080');
});
