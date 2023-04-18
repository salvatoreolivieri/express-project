const launchesDatabase = require("./launches.mongo")
const planets = require("./planets.mongo")

const DEFAULT_FLIGHT_NUMBER = 100
const launches = new Map()

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

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber")

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber
}

//  Save
const saveLaunch = async (launch) => {
  // Check if the launch target planet exist in our Database
  const planet = await planets.findOne({
    keplerName: launch.target,
  })

  if (!planet) {
    throw new Error("No matching planet found!") // This is a best practies: https://github.com/goldbergyoni/nodebestpractices
  }

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  )
}

saveLaunch(launch)

// GET
const getAllLaunches = async () => {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
}

// POST
const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1

  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customers: ["Zero To Mastery", "NASA"],
    flightNumber: newFlightNumber,
  })

  await saveLaunch(newLaunch)
}

// DELETE
const existLaunchWithId = async (launchId) => {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  })
}

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  )

  return aborted.modifiedCount === 1 && aborted.matchedCount === 1
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existLaunchWithId,
}
