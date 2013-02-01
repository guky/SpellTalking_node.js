var app = require('express').createServer()
var io = require('socket.io').listen(app);
var fs = require('fs');
var moment = require('./moment.min.js');
//var dbmodule = require('./db.js');
var usernames = {};
app.listen(8080);

// routing
app.get('/audio', function (req, res) {
  console.log(req);
  res.sendfile(__dirname + '/soundmanager/vk_api.html');
});
app.get('/', function (req, res) {
var index = fs.readFileSync('index.html');
  //res.sendfile(__dirname + '/index.html');
  res.end(index);
});
app.get('/*', function (req, res) {
  console.log(req);
  res.sendfile(__dirname + '/'+req.params[0]);
});


// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {
	
	// when the client emits 'sendchat', this listens and executes	
	//console.log(date)
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		//moment().format('DD-MM - HH:mm:ss a')
		io.sockets.emit('updatechat', usernames[socket.username].nick, data,moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),usernames[socket.username].color);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		var userc = {
			id: username,
			nick: username+'no_nick',
			color: '#F01233'			
		};
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = userc;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER','you have connected',moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),'#cc9900');		
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER',username + ' has connected',moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),'#cc9900');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER',socket.username + ' has disconnected',moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),'#cc9900');		
	});
	socket.on('setnick', function(data){
		// remove the username from global usernames list
		var oldnick = usernames[socket.username].nick;
		usernames[socket.username].nick = data
		// update list of users in chat, client-side
		socket.broadcast.emit('updateuser','nick', usernames[socket.username]);	
		socket.emit('updatechat', 'SERVER','you have changed nick to '+usernames[socket.username].nick,moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),'#cc9900');	
		socket.broadcast.emit('updatechat', 'SERVER', oldnick + ' has changed nick to ' + usernames[socket.username].nick,moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),'#cc9900');
	});
	socket.on('setcolor', function(data){
		// remove the username from global usernames list
		var oldcolor = usernames[socket.username].color;
		usernames[socket.username].color = data
		// update list of users in chat, client-side
		socket.broadcast.emit('updateuser','color', usernames[socket.username]);
		socket.emit('updatechat', 'SERVER','you have changed color to '+data,moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),'#cc9900');			
		socket.broadcast.emit('updatechat', 'SERVER', usernames[socket.username].nick+ ' has changed color to '+data,moment().utc().add('hours', 2).format('DD.MM - HH:mm:ss'),'#cc9900');
	});
});