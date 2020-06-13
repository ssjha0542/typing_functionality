socket.emit("message", {
        text: "Welcome to Chat Appliction !",
        timestamp: moment().valueOf(),
        name: "System"
});
//now server broadcast this message to all the users joined in the room
socket.on('joinRoom', function(req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        //broadcast new user joined room
        socket.broadcast.to(req.room).emit("message", {
                name: "System",
                text: req.name + ' has joined',
                timestamp: moment().valueOf()
        });
});
//server then broadccasts this notificcation
socket.on('typing', function(message) { 
        // broadcast this message to all users in that room
        socket.broadcast.to(clientInfo[socket.id].room).emit("typing", message);
});
 //Server listens to the above client event , then after checking if the input message is not a predefined 
//command {@currentUsers gives list of users in current chat room}, broadcasts the received message
socket.on("message", function(message) {
        console.log("Message Received : " + message.text);
        // to show all current users
        if (message.text === "@currentUsers") {
                sendCurrentUsers(socket);
        } else {
                //broadcast to all users except for sender
                message.timestamp = moment().valueOf();
                //socket.broadcast.emit("message",message);
                // now message should be only sent to users who are in same room
      socket.broadcast.to(clientInfo[socket.id].room).emit("message", message);
      //socket.emit.to(clientInfo[socket.id].room).emit("message", message);
    }
//Server side needs to be notified when user sees the message
// to check if user seen Message
socket.on("userSeen", function(msg) {
        socket.broadcast.to(clientInfo[socket.id].room).emit("userSeen", msg);
    //socket.emit("message", msg);
});
