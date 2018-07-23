const express = require("express");
const helmet = require("helmet");

const server = express();
const PORT = 8000;

// Middleware
server.use(helmet());

// API endpoints
server.get("/", (req, res) => {
  // res.send("<h1>Hello World</h1>");
  res.send({ hello: "world" });
});

// Server listening on port (const PORT) above
server.listen(PORT, () => console.log("Server running on PORT: " + PORT));
