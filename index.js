const express = require("express");
const helmet = require("helmet");
const db = require("./data/db");

const server = express();
express.json();
const PORT = 8000;

// Middleware
server.use(helmet());

// API endpoints
server.get("/", (req, res) => {
  res.send("<h1>Welcome to Node Express Mini</h1>");
});

server.get("/api/users", (req, res) => {
  const users = db.find();
  users
    .then(users => res.status(200).json(users));
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = db.findById(id);
  user
    .then(user => res.status(200).json(user));
});

// Server listening on port (const PORT) above
server.listen(PORT, () => console.log("Server running on PORT: " + PORT));
