const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
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
  }

  routes() {
    this.app.use("/api/auth", require("../routes/auth"));
    this.app.use("/api/users", require("../routes/user"));
    this.app.use("/api/categories", require("../routes/categories"));
    this.app.use("/api/products", require("../routes/products"));
    this.app.use("/api/search", require("../routes/search"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Listening on port ${this.port}`)
    );
  }
}

module.exports = Server;
