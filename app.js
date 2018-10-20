var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 3000;

app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/script'));

app.get('/', function(req, res){
    res.sendFile(index.html);
});

io.on('connection', function(socket){
    socket.on('newUser', function(room){
        socket.room = room;   
        var roomUsed = false;        
        socket.join(room);    
        //socket.to(room).emit('getBoardInfo');
        console.log("New Connection, room: " + room);
	});

    socket.on("draw",function(drawInfo,lineWidth,color,room){
        socket.broadcast.to(room).emit("drawDrawing",drawInfo,lineWidth,color);
    });

    socket.on("erase",function(drawInfo,lineWidth,room){
        socket.broadcast.to(room).emit("eraseDrawing",drawInfo,lineWidth);
    });
    
    socket.on("clearCanvas",function(room){
        socket.broadcast.to(room).emit("clearCanvasDrawing");
    });  

    socket.on('disconnect', function(){
        socket.leave(socket.room);
        console.log("Disconect from, room: " + socket.room);
	});
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});