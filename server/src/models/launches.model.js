const launches = new Map()

const launch = {
  flightNumber: 100,
  mission: "Kepler Exporation X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 21, 2022"),
  destination: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
}

launches.set(launch.flightNumber, launch)

const getAllLaunches = () => {
  return Array.from(launches.values())
}

module.exports = {
  getAllLaunches,
}
