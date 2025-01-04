const logger = require("./utils/logger")
const config = require("./utils/config")
const app = require("./app.js")

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
