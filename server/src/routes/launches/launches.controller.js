const { getAllLaunches } = require("../../models/launches.model")

const httpGetAllLaunches = (request, response) => {
  return response.status(200).json(getAllLaunches())
}

module.exports = {
  httpGetAllLaunches,
}
