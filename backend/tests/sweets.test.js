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
  it("should allow authenticated user to add a sweet", async () => {
    // Register
    await request(app).post("/api/auth/register").send({
      email: "sweet@test.com",
      password: "password",
    });

    // Login
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "sweet@test.com",
      password: "password",
    });

    const token = loginRes.body.token;

    // Add sweet
    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gulab Jamun",
        price: 10,
        quantity: 50,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Gulab Jamun");
  });

  it("should list all sweets", async () => {
    await Sweet.create({
      name: "Rasgulla",
      price: 12,
      quantity: 30,
    });

    const response = await request(app).get("/api/sweets");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
