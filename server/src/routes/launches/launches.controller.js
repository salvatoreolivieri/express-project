const { getAllLaunches, addNewLaunch } = require("../../models/launches.model")

// GET
const httpGetAllLaunches = (request, response) => {
  return response.status(200).json(getAllLaunches())
}

// POST
const httpAddNewLaunch = (request, response) => {
  const launch = request.body

  // Validation:
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return response.status(400).json({
      error: "Mission required launch property",
    })
  }

  launch.launchDate = new Date(launch.launchDate)

  if (isNaN(launch.launchDate)) {
    return response.status(400).json({
      error: "Invalid launch date",
    })
  }

  addNewLaunch(launch)
  return response.status(201).json(launch)
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
}
