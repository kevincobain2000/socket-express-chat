
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

//app.use(express.session());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  
});

app.get("/", function(req, res){
    res.render("index.ejs");    

});



app.post("/", function(req, res){
    console.log("THIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    console.log(req.body);
    res.send({"THIS":"is"});
});

console.log(routes.name()); 
io = io.listen(server);
io.sockets.on('connection', function (socket) {
  socket.on('newMessage',function(data){
     io.sockets.emit("messageFromApp",{appendIt:data['msg'],time:data['time']}) ;
  });
  
  var con = io.sockets.manager.connected;
  //Emit the connection Note that this is io.sockets.emit NOT socket.emit because it is broadcaseted
  //to all sockets
  io.sockets.emit('conn',{conns:Object.keys(con).length});
    console.log(socket.id);
    
  socket.on('disconnect', function(data){
      var con = io.sockets.manager.connected;
      console.log("disconencted");
      io.sockets.emit('conn',{conns:Object.keys(con).length-1}); //decrement on disconnection
      console.log(socket.id);
  });
  
});
