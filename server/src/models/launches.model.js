const launches = new Map()

let latestFlightNumber = 100

const launch = {
  flightNumber: 100,
  mission: "Kepler Exporation X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 21, 2022"),
  target: "Kepler-442 b",
  customer: ["ZeroToMastery", "NASA"],
  upcoming: true,
  success: true,
}

launches.set(launch.flightNumber, launch)

const getAllLaunches = () => {
  return Array.from(launches.values())
}

const addNewLaunch = (launch) => {
  latestFlightNumber++

  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ["ZeroToMastery", "NASA"],
      upcoming: true,
      success: true,
    })
  )
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
}
