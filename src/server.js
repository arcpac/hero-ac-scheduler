const http = require("http");
const app = require("./app");
const { mongoConnect } = require("../src/services/mongo")
const server = http.createServer(app);


async function startServer() {
  await mongoConnect()
  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}...`);
  });
}
startServer();
