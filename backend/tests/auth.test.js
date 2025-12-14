require("dotenv").config();
jest.setTimeout(20000);


const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app.js");
const User = require("../src/models/User");
const connectDB = require("../src/config/db.js");

beforeAll(async () => {
  await connectDB();
  await User.init(); 
});

beforeEach(async () => {
  await User.deleteMany({});
});


afterAll(async () => {
  await mongoose.connection.close();
});



describe("Auth API - Registration", () => {
  it("should register a new user and store a hashed password", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      email: "hash@test.com",
      password: "plaintext123",
    });

  expect(response.statusCode).toBe(201);

  const userInDb = await User.findOne({ email: "hash@test.com" });
  expect(userInDb.password).not.toBe("plaintext123");
});


  it("should fail when email or password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "",
      });

    expect(response.statusCode).toBe(400);
  });

  it("should not allow registration with duplicate email", async () => {
  // First registration
  await request(app)
    .post("/api/auth/register")
    .send({
      email: "duplicate@test.com",
      password: "123456",
    });

  // Second registration with same email
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      email: "duplicate@test.com",
      password: "abcdef",
    });

  expect(response.statusCode).toBe(400);
});

});
