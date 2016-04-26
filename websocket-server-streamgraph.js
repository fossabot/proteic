var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

io.on('connection', (socket) => {
	console.log('user connected');
});

var index = 0;
var startdate = "20.03.2010";

setInterval(() => {
	var new_date = moment(startdate, "DD-MM-YYYY").add('days', 1);
	var newDateString = new_date.format("DD/MM/YYYY");
	var data = [];
	startdate = newDateString;
	for (var i = 0; i < 10; i++) {
		var v1 = Math.random() * 0.5;
		var v2 = Math.abs(0.5 - v1);
		var v3 = Math.random() * 0.5;
		var v4 = Math.abs(0.5 - v3);
		data.push({
			date: newDateString,
			key: '<18',
			value: v1
		});
		data.push({
			date: newDateString,
			key: '[18-30]',
			value: v2
		});
		data.push({
			date: newDateString,
			key: '[30-50]',
			value: v3
		});
		data.push({
			date: newDateString,
			key: '> 50',
			value: v4
		});
	}
	console.log('sending', data);
	io.emit('dataMessage', data);
}, 500);

http.listen(3000, function () {
	console.log('listening on *:3000');
});
