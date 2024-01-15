const request = require("supertest")
const app = require("../app")
const { mongoConnect, mongoDisconnect } = require("../services/mongo")

describe("Users API", () => {
    beforeAll(async () => {
        await mongoDisconnect()
        await mongoConnect()
    })
    afterAll(async () => {
        await mongoDisconnect()
    })
    describe("Get all users", () => {
        test("It should respond with 200 status", async () => {
            const response = await request(app)
                .get("/users")
                .expect("Content-Type", /json/)
                .expect(200)
        })
    })
})