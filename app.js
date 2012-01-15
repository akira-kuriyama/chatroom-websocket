var express = require('express');
var routes = require('./routes');
var sio = require('socket.io');

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// ルーティングの設定
app.get('/', routes.index);
var routes2 = require('./routes/enter');
app.post('/enter',routes2.enter);
app.get('/enter', function(req, res){
	res.redirect('/');	
});

var io = sio.listen(app);
var routes3 = require('./routes/chat');
routes3.io = io;
 // クライアントが接続してきたときの処理
io.sockets.on('connection', routes3.chat);

