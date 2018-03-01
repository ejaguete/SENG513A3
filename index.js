var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

var users = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    console.log('user connected');
    socket.on('chat', function(msg){
        if(isReqNickname(msg))
            console.log("user set nick to " + getNickname(msg));
        else
	        io.emit('chat', msg);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
});

function isReqNickname(msg) {
    return msg.substring(0, 5) === "/nick";

}

function getNickname(msg) {
    return msg.split(" ")[1];
}

function checkNickname(nick) {
    if(users.indexOf(nick) > -1) {
        users.push(nick);
        console.log(nick + " is available");
    } else {
        console.log(nick + " is unavailable.");
    }
}
