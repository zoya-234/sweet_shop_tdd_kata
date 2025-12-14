require("dotenv").config();
jest.setTimeout(20000);

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app");
const connectDB = require("../src/config/db");
const Sweet = require("../src/models/Sweet");

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await Sweet.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Sweet Shop API", () => {

  it("should NOT allow non-admin user to add a sweet", async () => {
    // Register normal user
    await request(app).post("/api/auth/register").send({
      email: "user@test.com",
      password: "password",
    });

    // Login
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "password",
    });

    const token = loginRes.body.token;

    // Try to add sweet
    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gulab Jamun",
        category: "Milk",
        price: 10,
        quantity: 50,
      });

    // Expect forbidden
    expect(response.statusCode).toBe(403);
  });

  it("should list all sweets", async () => {
    await Sweet.create({
      name: "Rasgulla",
      category: "Milk",
      price: 12,
      quantity: 30,
    });

    const response = await request(app).get("/api/sweets");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Rasgulla");
  });

});
