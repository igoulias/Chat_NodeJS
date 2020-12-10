//NodeJS module that implements useful functions
let users = []; //list of users

function joinUser(socketId, userName, roomName) { //function that adds new user

    const user = { //user's attributes
        socketID: socketId,
        username: userName,
        roomname: roomName,
    }
    users.push(user)
    return user
}

function removeUser(id) {
    const getID = users => users.socketID === id;
    const index = users.findIndex(getID);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function printUsers() {
    return users;
}

module.exports = {joinUser, removeUser, printUsers}
