const {planets} = require("../../models/planets.model")

const getAllPlanets = (request, response) => {
  return response.status(200).json(planets)
}

module.exports = { getAllPlanets }
