var socket = io();

var userid;
var nick;

// http://psitsmike.com/2011/09/node-js-and-socket-io-chat-tutorial/
// idk what i was doing but i need to register nicknames
// and only show specific nickname to socket connected

socket.on('connect', function() {
   socket.emit('reqDefaultNickname');

   socket.on('rcvNickname', function(id, nickname) {
       userid = id;
       nick = nickname;
       $('#userbox').text(nick);
   });

   socket.on('updateChat', function(nickname, msg) {
       $('#messages').append($('<li>').html("<span id='username'>" + nickname + ":</span> "+ msg))
   });
});

// on page load
$(function() {
    $('form').submit(function(){
        socket.emit('sendMsg', nick, $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('broadcastMsg', function(msg){
	$('#messages').append($('<li>').text(msg));
    });
});
