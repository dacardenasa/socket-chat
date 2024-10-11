const express = require("express");
const fileUpload = require("express-fileupload");

const cors = require("cors");
const { createServer } = require("http");

const { connectMongoDB } = require("../database/config");
const { socketController } = require("../sockets/controller");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = require("socket.io")(this.server);
    // Connect DB
    this.connectDB();
    // Midlewares
    this.middlewares();
    // App routes load
    this.routes();
  }

  async connectDB() {
    await connectMongoDB();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // Reading and body parsing
    this.app.use(express.json());
    // Public directory
    this.app.use(express.static("public"));
    // File upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true
      })
    );
    // Sockets
    this.sockets();
  }

  routes() {
    this.app.use("/api/auth", require("../routes/auth"));
    this.app.use("/api/categories", require("../routes/categories"));
    this.app.use("/api/products", require("../routes/products"));
    this.app.use("/api/search", require("../routes/search"));
    this.app.use("/api/uploads", require("../routes/uploads"));
    this.app.use("/api/users", require("../routes/user"));
  }

  sockets() {
    this.io.on("connection", ( socket ) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () =>
      console.log(`Listening on port ${this.port}`)
    );
  }
}

module.exports = Server;
