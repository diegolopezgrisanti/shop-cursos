const Server = require("./src/server");
const db = require("./src/models");

const server = new Server();

server.start();
db.test();