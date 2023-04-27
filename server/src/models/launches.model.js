const axios = require("axios")
const launchesDatabase = require("./launches.mongo")
const planets = require("./planets.mongo")

const DEFAULT_FLIGHT_NUMBER = 100
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

// Find
const findLaunch = async (filter) => {
  return await launchesDatabase.findOne(filter)
}

// Save
const saveLaunch = async (launch) => {
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

// Populate
const populateLaunches = async () => {
  console.log("Downloading launch data...")

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  })

  if (response.status !== 200) {
    console.log("Problem downloading launch data")
    throw new Error("Launch data download failed")
  }

  const launchDocs = response.data.docs

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"]
    const customers = payloads.flatMap((payload) => {
      return payload["customers"]
    })

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    }

    console.log(`${launch.flightNumber}: ${launch.mission}`)

    await saveLaunch(launch)
  }
}

// Load
const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  })

  if (firstLaunch) {
    console.log("launch data already loaded!")
  }

  await populateLaunches()
}

// GET
const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber")

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber
}

const getAllLaunches = async (skip, limit) => {
  return await launchesDatabase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({
      flightNumber: 1, // 1 for ascending, -1 for descending
    })
    .skip(skip)
    .limit(limit)
}

// POST
const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  })

  if (!planet) {
    throw new Error("No matching planet found!") // This is a best practies: https://github.com/goldbergyoni/nodebestpractices
  }

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
  return await findLaunch({
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

// EXPORT
module.exports = {
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existLaunchWithId,
}
