// Express App
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 8000

// Model
const { loadPlanet } = require("./models/planets.model")

// Start Server
async function startServer() {
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
