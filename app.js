// CIS 197 - React HW
// Author - Devesh Dayal, Steve Vitali
// Simple Express server to serve static files
var express = require('express');
var path = require('path');
var ejs = require('ejs');

var app = express();
var port = process.env.PORT || 3000;

app.set('port', port);

// Use the EJS rendering engine for HTML located in /views
app.set('views', __dirname + '/views');
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// Host static files on URL path
app.use(express.static(path.join(__dirname, 'public')));

// Use express Router middleware for root path
// app.use(app.router);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/export', function (req, res) {
  res.json(JSON.parse(req.query.data));
});

// Start server
app.listen(app.get('port'), function () {
  console.log('Express game server listening on port ' + port);
});
