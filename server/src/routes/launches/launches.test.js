const request = require("supertest")
const app = require("../../server")

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200)
  })
})

describe("Test POST /launch", () => {
  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send({
        mission: "USS Enterprice",
        rocket: "NCC 1701-D",
        target: "Kepler",
        launchDate: "October 3, 1998",
      })
      .expect("Content-Type", /json/)
      .expect(201)
  })
})
