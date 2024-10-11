const { Socket } = require("socket.io");
const { fetchUserWithToken } = require("../helpers");
const ChatRoom = require("../models/chatRoom");

const chatRoom = new ChatRoom();

const socketController = async (socket = new Socket(), io) => {
  const user = await fetchUserWithToken(socket.handshake.headers["x-token"]);

  if (!user) {
    return socket.disconnect();
  }

  // add connected user
  chatRoom.connectUser(user);
  io.emit("get-active-users", chatRoom.activeUsers);
  socket.emit("get-messages", chatRoom.last10Messages);

  // Connect to special chat room
  socket.join(user._id);

  // clean connected user
  socket.on("disconnect", () => {
    chatRoom.disconnectUser(user._id);
    io.emit("get-active-users", chatRoom.activeUsers);
  });

  //
  socket.on("send-message", ({ message, uid }) => {
    if (uid) {
      socket.to(uid).emit("get-private-message", { from: user.name, message });
    } else {
      chatRoom.sendMessage(user._id, user.name, message);
      io.emit("get-messages", chatRoom.last10Messages);
    }
  });
};

module.exports = {
  socketController
};
