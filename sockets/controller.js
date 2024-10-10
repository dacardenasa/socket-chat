const { Socket } = require("socket.io");
const { fetchUserWithToken } = require("../helpers");

const socketController = async (socket = new Socket()) => {
  const user = await fetchUserWithToken(socket.handshake.headers["x-token"]);
  console.info({ user })
  if (!user) {
    return socket.disconnect();
  }

  console.info(`The user ${user.name} is connected`);
};

module.exports = {
  socketController
};
