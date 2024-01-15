const http = require("http");
const app = require("./app");
const path = require("path")

const express = require("express");
const { mongoConnect } = require("../src/services/mongo")


app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "frontend", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "public", "index.html"));
});

const server = http.createServer(app);


async function startServer() {
  await mongoConnect()
  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}...`);
  });
}
startServer();
