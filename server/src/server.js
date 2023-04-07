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

//Model

// Use
app.use(
  cors({
    origin: "http://localhost:3000",
  })
)
app.use(morgan("combined"))

app.use(express.json())
app.use(planetsRouter)

app.use(express.static(path.join(__dirname, "..", "public")))
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "..", "public", "index.html"))
})
