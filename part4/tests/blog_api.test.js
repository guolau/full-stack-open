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
    assert.strictEqual(blogs.length, response.body.length)
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

    assert.strictEqual(listResponse.body.length, blogs.length + 1)
  })

  test("creates with correct info", async () => {
    const response = await api.post("/api/blogs").send(blog)
    const blogInDb = await Blog.findOne({ _id: response.body.id })
    assert.deepStrictEqual(response.body, new Blog(blog).toJSON())
    assert.deepStrictEqual(blogInDb.toJSON(), new Blog(blog).toJSON())
  })

  test("with missing likes defaults to 0", async () => {
    const blogMissingLikes = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    const response = await api.post("/api/blogs").send(blogMissingLikes)

    assert.strictEqual(response.body.likes, 0)
  })

  test("with missing title results in 400 error", async () => {
    const blogMissingTitle = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    await api.post("/api/blogs").send(blogMissingTitle).expect(400)
  })

  test("with missing url results in 400 error", async () => {
    const blogMissingUrl = {
      title: "Type wars",
      author: "Robert C. Martin",
    }

    await api.post("/api/blogs").send(blogMissingUrl).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
