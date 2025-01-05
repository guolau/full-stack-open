const { test, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const { blogs } = require("./test_helper")
const Blog = require("../models/blogs")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const promises = blogs.map((blog) => new Blog(blog).save())
  await Promise.all(promises)
})

describe("/api/blogs", () => {
  test("responds with JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })
  test("responds with correct number of blogs", async () => {
    const response = await api.get("/api/blogs")
    assert.strictEqual(response.body.length, blogs.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
