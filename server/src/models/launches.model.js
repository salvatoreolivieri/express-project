const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 100,
  mission: "Kepler Exporation X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 21, 2022"),
  target: "Kepler-442 b",
  customers: ["ZeroToMastery", "NASA"],
  upcoming: true,
  success: true,
}

launches.set(launch.flightNumber, launch)

// GET
const getAllLaunches = () => {
  return Array.from(launches.values())
}

// POST
const addNewLaunch = (launch) => {
  latestFlightNumber++

  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["ZeroToMastery", "NASA"],
      upcoming: true,
      success: true,
    })
  )
}

// DELETE
const existLaunchWithId = (launchId) => {
  return launches.has(launchId)
}

const abortLaunchById = (launchId) => {
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false

  return aborted
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  existLaunchWithId,
}
