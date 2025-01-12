const logger = require("./logger")

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Invalid id format" })
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .send({ error: "expected `username` to be unique" })
  } else if (
    error.name === "JsonWebTokenError" &&
    error.message.includes("jwt must be provided")
  ) {
    return response.status(401).json({ error: "bearer token required" })
  } else if (
    error.name === "JsonWebTokenError" &&
    error.message.includes("invalid token")
  ) {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler }
