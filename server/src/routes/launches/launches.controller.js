const {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  existLaunchWithId,
} = require("../../models/launches.model")

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

// DELETE
const httpAbortLaunch = (request, response) => {
  const launchId = Number(request.params.id)
  const aborted = abortLaunchById(launchId)

  return existLaunchWithId(launchId)
    ? response.status(200).json(aborted)
    : response.status(404).json({
        error: "Launch not found",
      })
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}
