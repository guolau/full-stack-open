const blogsRouter = require("express").Router()
const Blog = require("../models/blogs")
const User = require("../models/users")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  if (!request.token) {
    return response.status(400).json({ error: "bearer token required" })
  }

  const user = await User.findById(request.token.id)
  const blog = new Blog({ ...request.body, user })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  response.json(result)
})

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.token) {
    return response.status(400).json({ error: "bearer token required" })
  }

  const user = await User.findById(request.token.id)
  const blog = await Blog.findById(request.params.id).populate("user")

  if (blog && blog.user.id !== user.id) {
    return response.status(401).end()
  }

  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

module.exports = blogsRouter
