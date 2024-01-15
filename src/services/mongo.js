const mongoose = require("mongoose");
const MONGO_URL = process.env.CONNECTION

mongoose.connection.once("open", () => {
    console.log("Database connection ready")
})
mongoose.connection.on("error", (err) => {
    console.error(err)
})
async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
    await mongoose.disconnect(MONGO_URL)
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}