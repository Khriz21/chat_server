const express = require("express");
const path = require("path");
require("dotenv").config();

//? Db Config
require("./database/config").dbConnection();

//? App de express
const app = express();

//* Lectura y parseo del body
app.use(express.json());

//* Node Server
const server = require("http").createServer(app);
module.exports.io = require("socket.io")(server);

require("./sockets/socket");

//? path público
const publicPath = path.resolve(__dirname, "public");

//? Mis rutas
app.use("/api/login", require("./routes/auth"));

app.use(express.static(publicPath));

server.listen(process.env.PORT, (err) => {
  if (err) throw new Error("Err");
  console.log(`Run server in port: ${process.env.PORT}`);
});
