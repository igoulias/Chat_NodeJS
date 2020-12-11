var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require('path');
const {joinUser, removeUser, printUsers} = require('./users');
var publicPath = path.resolve(__dirname, 'Public');

app.use(express.static(publicPath)); //Allow access to static files in Public folder
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html"); //serve index.html
});

let thisRoom = "";
io.on("connection", function (socket) {
    console.log("connected");

    socket.on('join room', (data) => { //when join room event is caught
        console.log('in room');
        let Newuser = joinUser(socket.id, data.username, data.roomName) //create new user with the data received
        socket.emit('send data', {id : socket.id, username:Newuser.username, roomname:Newuser.roomname}); //emit send data event
        thisRoom = Newuser.roomname;
        console.log(Newuser);
        socket.join(Newuser.roomname);
    });

    socket.on("chat message", (data) => { //when chat message event is caught send chat message event with socket id and the just received data to the according room
        io.to(data.roomname).emit("chat message", {data:data, id:socket.id});
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            console.log(user.username + ' has left');
        }
        console.log("disconnected");
    });

    socket.on("list users", () => {
        const list = printUsers();
        socket.emit("list sent",{list});
    });
});

http.listen(3000);
