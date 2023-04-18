const {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existLaunchWithId,
} = require("../../models/launches.model")

// GET
const httpGetAllLaunches = async (request, response) => {
  return response.status(200).json(await getAllLaunches())
}

// POST
const httpAddNewLaunch = async (request, response) => {
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

  await scheduleNewLaunch(launch)
  return response.status(201).json(launch)
}

// DELETE
const httpAbortLaunch = async (request, response) => {
  const launchId = Number(request.params.id)

  const existsLaunch = await existLaunchWithId(launchId)
  if (!existsLaunch) {
    return response.status(404).json({
      error: "Launch not found",
    })
  }

  const aborted = await abortLaunchById(launchId)

  return aborted
    ? response.status(200).json({
        aborted: true,
      })
    : response.status(404).json({
        error: "Launch not aborted",
      })
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}
