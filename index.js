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
    console.log('SERVER: user connected');

    // client requests a nickname from the server
    // server sends nickname to client and sends alert via chat
    socket.on('reqDefaultNickname', function() {
        let id = users.length;
        let nickname = 'user' + (id+1).toString();
        users[id] = nickname;
        socket.username = nickname;
        console.log('SERVER: user' + id + ' assigned nickname \'' + nickname + '\'');
        socket.emit('rcvNickname', id, nickname);
        socket.emit('updateChat', 'SERVER', 'Welcome, ' + nickname);
        console.log('users online: ' + users);
    });

    // client sends msg to server
    socket.on('sendMsg', function(nick, msg){
        // check if requesting nickname change
        if(isReqNickname(msg)) {
           let newnick = getNickname(msg);
           if(!nicknameIsInUse(newnick)) {
               let userid = users.indexOf(socket.username);
               users[userid] = newnick;
               socket.username = newnick;
               console.log('SERVER: user' + nick + ' assigned nickname \'' + newnick + '\'');
               socket.emit('rcvNickname', userid, newnick);
               socket.emit('updateChat', 'SERVER', 'Nickname changed to ' + socket.username);
           } else {
               console.log('SERVER: Nickname ' + newnick + ' already in use');
           }
        }
        else {
            io.sockets.emit('updateChat', nick, msg);
        }
    });

    socket.on('disconnect', function() {
        users.splice(users.indexOf(socket.username), 1);
        console.log( socket.username + ' disconnected');
        console.log('users online: ' + users);
    })
});

function isReqNickname(msg) {
    return msg.substring(0, 5) === "/nick";
}

function getNickname(msg) {
    return msg.split(" ")[1];
}

function nicknameIsInUse(nick) {
    return users.indexOf(nick) > -1;
}
