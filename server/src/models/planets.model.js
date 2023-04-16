const fs = require("fs")
const path = require("path")
const { parse } = require("csv-parse")

const habitablePlanets = []

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  )
}

const loadPlanet = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data)
        }
      })
      .on("error", (err) => {
        reject()
      })
      .on("end", () => {
        resolve()
      })
  })
}

const getAllPlanets = () => {
  return habitablePlanets
}

module.exports = {
  loadPlanet,
  getAllPlanets,
}
