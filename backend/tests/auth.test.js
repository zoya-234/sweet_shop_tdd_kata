require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app.js");
const connectDB = require("../src/config/db.js");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

jest.setTimeout(20000);

describe("Auth API - Registration", () => {
  it("should register a new user and return the email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "persist@test.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.user.email).toBe("persist@test.com");
  });

  it("should fail when email or password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "",
      });

    expect(response.statusCode).toBe(400);
  });
});
