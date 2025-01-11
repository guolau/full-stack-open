const { test, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const User = require("../models/users")

const api = supertest(app)

const validUser = {
  username: "user123",
  password: "test123",
}

beforeEach(async () => {
  await User.deleteMany({})
})

describe("create user", () => {
  test("works for valid user", async () => {
    await api.post("/api/users").send(validUser).expect(201)
  })

  test("fails for invalid usernames", async () => {
    await api.post("/api/users").send(validUser).expect(201)

    const invalidUsers = {
      duplicate: validUser, // duplicate username
      minLength: { username: "a", password: "pw098" },
      missing: { password: "pw567" },
    }

    const expectedErrors = {
      duplicate: /username.*unique/,
      minLength: /username.*minimum allowed length/,
      missing: /username.*required/,
    }

    for (const key in invalidUsers) {
      const response = await api
        .post("/api/users")
        .send(invalidUsers[key])
        .expect(400, expectedErrors[key])
    }
  })

  test("fails for invalid password", async () => {
    const invalidUser = {
      username: "pw-test",
      password: "0",
    }

    await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400, /password must be at least 3 characters long/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
