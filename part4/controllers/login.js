const loginRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/users")
const config = require("../utils/config")

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const isCorrectPassword =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!isCorrectPassword) {
    return response
      .status(401)
      .json({ error: "username or password incorrect" })
  }

  const token = jwt.sign(
    { username: user.username, id: user.id },
    config.SECRET
  )

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
