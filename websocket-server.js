var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var index = 0;

io.on('connection', (socket) => {
	console.log('user connected');
});

setInterval(() => {
	var data = [];
	for (var i = 0; i < 3; i++) {
		data.push({
			x: (++index),
			y: parseInt(Math.random() * (100 - 20) + 20)
		});
	}
	io.emit('dataMessage', data);
}, 500);

http.listen(3000, function () {
	console.log('listening on *:3000');
});
