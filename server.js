var express = require('express');
//var app = require('express')();
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var os = require('os');

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '/public')));

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

var accelData;
var temp;
var location;
var port_number = server.listen(process.env.PORT || 3000);
server.listen(port_number, process.argv[2], function() {
	var host = server.address().address
	var port = server.address().port
	console.log("Server listening on %s:%s...", host, port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/location', function(req, res) {
	location = req.body
	io.emit('location', location);	
	console.log(req.body.city)
});


app.post('/accel', function(req, res) {
  //console.log(req.body.nodeID)
  //console.log(req.body.data.temp)

  accelData = req.body

  io.emit('accelData', accelData);

  temp = req.body.data.temp
    
  //io.emit('temp', temp);
});

io.on('connection', function (socket) {
	socket.on('location', function (data) {
		console.log(data);
	});
	//socket.on('accelData', function (data) {
		//console.log(data);
	//});
});
