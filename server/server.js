'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
