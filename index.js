const express = require("express");
const helmet = require("helmet");
const db = require("./data/db");

const server = express();
const PORT = 8000;

// Middleware
server.use(helmet());
server.use(express.json());

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

server.post("/api/users", (req, res) => {
  const user = req.body;
  const dates = {
    created_at: Date.now(),
    updated_at: Date.now(),
  }

  if (!req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({errorMessage: 'Please provide name and bio for the user.'})
  }

  const addUser = db.insert({
    ...user,
    ...dates,
  });

  addUser
    .then(id => res.status(201).json(id))
    .catch(err => console.error(err));
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const dates = {
    created_at: Date.now(),
    updated_at: Date.now(),
  }
  const updateUser = db.update(id, {...user, ...dates});
  
  updateUser
    .then(updatedUser => res.status(200).json(updatedUser))
    .catch(err => console.error(err));
});

// Server listening on port (const PORT) above
server.listen(PORT, () => console.log("Server running on PORT: " + PORT));
