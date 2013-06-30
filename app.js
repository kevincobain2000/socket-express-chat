
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , io = require('socket.io')
  , path = require('path')
  , redis = require('redis');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  
});

io = io.listen(server);
console.log(routes.name()); 

io.sockets.on('connection', function (socket) {
    
  socket.on('newMessage',function(data){
     io.sockets.emit("messageFromApp",{appendIt:data['msg']}) ;
  });
  
  var con = io.sockets.manager.connected;
  //Emit the connection Note that this is io.sockets.emit NOT socket.emit because it is broadcaseted
  //to all sockets
  io.sockets.emit('conn',{conns:Object.keys(con).length});
    console.log(socket.id);
  
});

