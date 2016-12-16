var express = require('express');
var path = require('path');
var ejs = require('ejs');

var app = express();
var port = process.env.PORT || 3000;

app.set('port', port);

app.set('views', __dirname + '/views');
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/export', function (req, res) {
  res.json(JSON.parse(req.query.data));
});

app.listen(app.get('port'), function () {
  console.log('Express game server listening on port ' + port);
});
