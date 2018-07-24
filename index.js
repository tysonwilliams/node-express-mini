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
  const getUsers = db.find();

  getUsers
    .then(users => res.status(200).json(users))
    .catch(err => {
      res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const getUser = db.findById(id);

  getUser
    .then(user => {
      if (user.length === 0) {
        return res
          .status(400)
          .json({ errorMessage: "The user with the specified ID does not exist." });
      }
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ errorMessage: "The user information could not be retrieved." }));
});

server.post("/api/users", (req, res) => {
  const user = req.body;
  const dates = {
    created_at: Date.now(),
    updated_at: Date.now(),
  }
  const addUser = db.insert({...user, ...dates});

  if (!req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  addUser
    .then(id => res.status(201).json(id))
    .catch(err => {
      res.status(500).json({errorMessage: "There was an error while saving the user to the database", err: err });
    });
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const dates = {
    created_at: Date.now(),
    updated_at: Date.now(),
  }
  const updateUser = db.update(id, {...user, ...dates});

  if (!req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  updateUser
    .then(updatedUserCount => {
      if (updatedUserCount !== 1) {
        return res
          .status(404)
          .json({ errorMessage: "The user with the specified ID does not exist." });
      }
      res.status(200).json({...user, ...dates});
    })
    .catch(err => {
      res
      .status(500).json({ errorMessage: "The user information could not be modified.", err: err })
      .end();
    });
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const deleteUser = db.remove(id);

  deleteUser
    .then(userDeletedCount => {
      if (userDeletedCount !== 1) {
        return res
          .status(404)
          .json({ errorMessage: "The user with the specified ID does not exist." });
      }
      res.json(userDeletedCount);
    })
    .catch(err => {
      res
      .status(500).json({ errorMessage: "The user could not be removed.", err: err })
      .end();
    });
});

// Server listening on port (const PORT) above
server.listen(PORT, () => console.log("Server running on PORT: " + PORT));
