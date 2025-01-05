const { test, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const { blog, blogs } = require("./test_helper")
const Blog = require("../models/blogs")
var _ = require("lodash")

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
    const blogInDb = await Blog.findById(response.body.id)
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

describe("update blog", () => {
  const idToUpdate = blogs[0]._id
  const updatedBlog = {
    title: "Updated blog",
    author: "John Doe",
    url: "https://fullstackopen.com/en/part4/testing_the_backend#test-environment",
    likes: 99,
  }

  test("succeeds with correct response", async () => {
    await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("saves with correct info", async () => {
    const response = await api.put(`/api/blogs/${idToUpdate}`).send(updatedBlog)
    const blogInDb = await Blog.findById(idToUpdate)

    assert.deepStrictEqual(_.omit(response.body, ["id"]), updatedBlog)
    assert.deepStrictEqual(_.omit(blogInDb.toJSON(), ["id"]), updatedBlog)
  })
})

describe("delete blog", () => {
  test("succeeds with 204 code with valid id", async () => {
    const idToDelete = blogs[0]._id
    await api.del(`/api/blogs/${idToDelete}`).expect(204)
  })

  test("is missing from DB", async () => {
    const idToDelete = blogs[0]._id
    await api.del(`/api/blogs/${idToDelete}`)
    const blogInDb = await Blog.findById(idToDelete)
    assert.strictEqual(blogInDb, null)
  })
})

after(async () => {
  await mongoose.connection.close()
})
