var express = require("express");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io").listen(http);
const bodyParser = require('body-parser');

var db = require("./database");
var sockets = [];
var userName;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/static/login.html");
});

app.get('/index.html', function (req, res) {
	userName = req.query.userName;
	res.sendFile(__dirname + "/static/index.html");
});

app.get("/signup.html", function (req, res) {
	res.sendFile(__dirname+"/static/signup.html");
});

app.post("/signup.html", function(req,res){
	db.createUser(req.body).then(function(value){
		res.redirect("/")
	});
	
});

io.on("connection", function (scket) {
	console.log("a user connected!!!!!");
	scket.userName = userName;
	sockets.push({ "user": scket.userName, "id": scket.id });
	scket.on("setPseduo", function (msg) {
		sckect.set('pseduo', msg)
	});


	scket.on("disconnect", function () {
		console.log("user is disconnected!!!!!!!!");
	})


	scket.on("chat message", function (message) {
		io.emit("chat message", message);
		scket.to(sockets[sockets.length - 1]).emit("hey", "this is the message");
	});


	scket.on("privateMess", function (data) {
		var sendUser;
		console.log('got data from ', data);
		console.log(sockets);
		sockets.forEach(function (user) {
			if (user.user == data.toUser) {
				sendUser = user.id;
			}
		});
		console.log(sendUser);
		scket.to(sendUser).emit("privateMess", data.message);
	});

});

http.listen(3000, function () {
	console.log("Listening on port 3000");
});

