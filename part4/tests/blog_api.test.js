const { test, before, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const { blog, blogs, omit } = require("./test_helper")
const Blog = require("../models/blogs")
const User = require("../models/users")
var _ = require("lodash")

const api = supertest(app)
let token = null
let authorizedUser = null
const userInfo = { username: "blogTest", password: "12345" }

before(async () => {
  await User.deleteMany({ username: userInfo.username })
  await api.post("/api/users").send(userInfo)
  token = (await api.post("/api/login").send(userInfo)).body.token
  authorizedUser = await User.findOne({ username: userInfo.username })
})

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
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const listResponse = await api.get("/api/blogs")

    assert.strictEqual(listResponse.body.length, blogs.length + 1)
  })

  test("missing bearer token results in 401 error", async () => {
    await api.post("/api/blogs").send(blog).expect(401)
  })

  test("creates with correct info", async () => {
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)

    const blogInDb = await Blog.findById(response.body.id)
    const expectedBlogAsJSON = new Blog(blog).toJSON()

    assert.deepStrictEqual(omit(response.body, ["user"]), expectedBlogAsJSON)
    assert.deepStrictEqual(
      omit(blogInDb.toJSON(), ["user"]),
      expectedBlogAsJSON
    )
    assert.strictEqual(authorizedUser.id, blogInDb.user.toString())
  })

  test("with missing likes defaults to 0", async () => {
    const blogMissingLikes = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogMissingLikes)

    assert.strictEqual(response.body.likes, 0)
  })

  test("with missing title results in 400 error", async () => {
    const blogMissingTitle = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogMissingTitle)
      .expect(400)
  })

  test("with missing url results in 400 error", async () => {
    const blogMissingUrl = {
      title: "Type wars",
      author: "Robert C. Martin",
    }

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogMissingUrl)
      .expect(400)
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
  let blogToDelete = null

  before(async () => {
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(omit(blogs[0], ["_id"]))

    blogToDelete = response.body
  })

  test("succeeds with 204 code with valid id", async () => {
    await api
      .del(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)
  })

  test("is missing from DB", async () => {
    await api
      .del(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
    const blogInDb = await Blog.findById(blogToDelete.id)
    assert.strictEqual(blogInDb, null)
  })
})

after(async () => {
  await mongoose.connection.close()
})
