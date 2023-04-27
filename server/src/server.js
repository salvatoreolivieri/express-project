// Express App
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const mongoose = require("mongoose")

require("dotenv").config()

const api = require("./routes/api")
const app = express()
const PORT = process.env.PORT || 8090
const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!")
})

mongoose.connection.on("error", (error) => {
  console.error(error)
})

// Model
const { loadPlanet } = require("./models/planets.model")
const { loadLaunchData } = require("./models/launches.model")

// Start Server
const startServer = async () => {
  // MongoDB connection
  await mongoose.connect(MONGO_URL)
  await loadPlanet()
  await loadLaunchData()

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  })
}

startServer()

// Use
app.use(
  cors({
    origin: "http://localhost:3000",
  })
)
app.use(morgan("combined"))

app.use(express.json())
app.use("/v1", api)

app.use(express.static(path.join(__dirname, "..", "public")))
app.get("/*", (request, response) => {
  response.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app
