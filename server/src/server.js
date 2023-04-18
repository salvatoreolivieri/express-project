// Express App
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const mongoose = require("mongoose")

const app = express()
const PORT = process.env.PORT || 8090
const MONGO_URL =
  "mongodb+srv://nasa-api:mBk7P7xY1hGsM8gQ@nasacluster.1kxyjg0.mongodb.net/?retryWrites=true&w=majority"

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!")
})

mongoose.connection.on("error", (error) => {
  console.error(error)
})

// Model
const { loadPlanet } = require("./models/planets.model")

// Start Server
const startServer = async () => {
  // MongoDB connection
  await mongoose.connect(MONGO_URL)

  await loadPlanet()

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  })
}

startServer()

// Routes
const planetsRouter = require("./routes/planets/planets.router")
const launchesRouter = require("./routes/launches/launches.router")

// Use
app.use(
  cors({
    origin: "http://localhost:3000",
  })
)
app.use(morgan("combined"))

app.use(express.json())
app.use("/planets", planetsRouter)
app.use("/launches", launchesRouter)

app.use(express.static(path.join(__dirname, "..", "public")))
app.get("/*", (request, response) => {
  response.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app
