const { Socket } = require("socket.io")

const socketController = (socket = new Socket()) => {
    console.info("new client connected", socket.id);
}

module.exports = {
    socketController
}