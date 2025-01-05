const { test, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const { blog, blogs } = require("./test_helper")
const Blog = require("../models/blogs")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const promises = blogs.map((blog) => new Blog(blog).save())
  await Promise.all(promises)
})

describe("list blogs", () => {
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

test("id key is named 'id'", async () => {
  const response = await api.get("/api/blogs")
  const blog = response.body[0]
  assert(blog.hasOwnProperty("id"))
})

describe("create blog", () => {
  test("increases total blogs by 1", async () => {
    await api
      .post("/api/blogs")
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const listResponse = await api.get("/api/blogs")

    assert.strictEqual(blogs.length + 1, listResponse.body.length)
  })

  test("creates with correct info", async () => {
    const response = await api.post("/api/blogs").send(blog)
    const blogInDb = await Blog.findOne({ _id: response.body.id })
    assert.deepStrictEqual(new Blog(blog).toJSON(), response.body)
    assert.deepStrictEqual(new Blog(blog).toJSON(), blogInDb.toJSON())
  })
})

after(async () => {
  await mongoose.connection.close()
})
