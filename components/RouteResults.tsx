"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface TransitRoute {
  id: string // Unique ID for the itinerary (e.g., itinerary index)
  from: string // From location name
  to: string // To location name
  mode: string // Primary mode of transport (e.g., "BUS", "TRAIN", "WALK", "MIXED")
  price: number // Estimated price
  duration: string // Formatted total duration (e.g., "1h 30m")
  departure: string // Formatted start time of the itinerary
  arrival: string // Formatted end time of the itinerary
  provider: string // Main provider (e.g., "MTA New York City Transit" or "Mixed")
  co2: string // Estimated CO2
  transfers: number
  walkTime: string // Formatted walk time
  transitTime: string // Formatted transit time
  waitingTime: string // Formatted waiting time
  legs: OTPLeg[] // Added to store detailed leg information
}

interface OTPItinerary {
  duration: number // seconds
  distance: number // meters
  startTime: number // milliseconds
  endTime: number // milliseconds
  walkTime: number // seconds
  walkDistance: number // meters
  transitTime: number // seconds
  waitingTime: number // seconds
  transfers: number
  legs: OTPLeg[]
}

interface OTPLeg {
  mode: string // e.g., "WALK", "BUS", "SUBWAY", "RAIL"
  duration: number // seconds
  distance: number // meters
  transitLeg: boolean
  from: { name: string; lat: number; lon: number; departure?: number }
  to: { name: string; lat: number; lon: number; arrival?: number }
  routeShortName?: string
  routeLongName?: string
  agencyName?: string
  intermediateStops?: { name: string; lat: number; lon: number }[] // Added intermediate stops
}

const transportIcons: { [key: string]: string } = {
  WALK: "🚶",
  BUS: "🚌",
  SUBWAY: "🚇",
  RAIL: "🚆",
  TRAM: "🚊",
  FERRY: "⛴️",
  CABLE_CAR: "🚠",
  GONDOLA: "🚡",
  FUNICULAR: "🚟",
  MIXED: "🔄", // For itineraries with multiple modes
  // Fallback for modes not explicitly handled by OTP or if no transit legs
  CAR: "🚗",
  FLIGHT: "✈️",
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  return `${minutes}m`
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
}

// Simple price estimation (can be refined)
const estimatePrice = (itinerary: OTPItinerary): number => {
  const baseFare = 2.75 // e.g., for a single transit ride
  const costPerMinuteTransit = 0.05 // $0.05 per minute of transit
  const costPerTransfer = 1.5 // $1.50 per transfer

  let price = 0
  if (itinerary.transitTime > 0) {
    price += baseFare // Assume at least one fare if there's transit
    price += (itinerary.transitTime / 60) * costPerMinuteTransit
    price += itinerary.transfers * costPerTransfer
  }
  // Walking cost is 0 as per request

  return Math.round(price * 100) / 100 // Round to 2 decimal places
}

// Simple CO2 estimation (very rough, needs real data)
const estimateCO2 = (itinerary: OTPItinerary): string => {
  const co2PerKmBus = 0.1 // kg CO2 per km
  const co2PerKmTrain = 0.03 // kg CO2 per km
  // const co2PerKmWalk = 0 // kg CO2 per km - walking has 0 CO2

  let totalCo2 = 0
  itinerary.legs.forEach((leg) => {
    const distanceKm = leg.distance / 1000
    if (leg.transitLeg) {
      if (leg.mode === "BUS") {
        totalCo2 += distanceKm * co2PerKmBus
      } else if (leg.mode === "RAIL" || leg.mode === "SUBWAY" || leg.mode === "TRAM") {
        totalCo2 += distanceKm * co2PerKmTrain
      }
      // Add other modes as needed
    }
  })
  return `${Math.round(totalCo2 * 10) / 10}kg` // Round to 1 decimal place
}

export function RouteResults() {
  const searchParams = useSearchParams()
  const [routes, setRoutes] = useState<TransitRoute[]>([])
  const [itinerary, setItinerary] = useState<TransitRoute[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState("duration") // Moved sort state here, default to duration

  const fromName = searchParams.get("fromName") || ""
  const fromLat = searchParams.get("fromLat") || ""
  const fromLon = searchParams.get("fromLon") || ""
  const toName = searchParams.get("toName") || ""
  const toLat = searchParams.get("toLat") || ""
  const toLon = searchParams.get("toLon") || ""
  const date = searchParams.get("date") || ""
  const time = searchParams.get("time") || "09:00" // Get time from URL

  // Helper function to format location names for display (City, Country)
  const formatLocationForDisplay = (fullName: string): string => {
    const parts = fullName.split(",").map((part) => part.trim())
    const city = parts[0]
    let country = ""

    // Find the country, usually the last part, but handle cases like "City, State, Country"
    // or "City, Country"
    if (parts.length > 1) {
      // Iterate from the end to find a likely country name (often capitalized, not a number)
      for (let i = parts.length - 1; i >= 1; i--) {
        const part = parts[i]
        // Simple heuristic: if it's not a number and looks like a country name
        if (isNaN(Number(part)) && part.length > 1 && part[0] === part[0].toUpperCase()) {
          country = part
          break
        }
      }
    }

    let formatted = city
    if (country && country !== city) {
      formatted += `, ${country}`
    }
    return formatted
  }

  // Fetch routes from Transitland OTP API
  useEffect(() => {
    const fetchRoutes = async () => {
      if (!fromLat || !fromLon || !toLat || !toLon || !date || !time) {
        setRoutes([])
        setError(null) // Clear previous errors if params are incomplete
        return
      }

      setLoading(true)
      setError(null)

      // Use the environment variable for the API key
      const apiKey = process.env.NEXT_PUBLIC_TRANSITLAND_API_KEY

      if (!apiKey) {
        setError("Transitland API key is not configured. Please set NEXT_PUBLIC_TRANSITLAND_API_KEY in your .env file.")
        setLoading(false)
        return
      }

      const apiUrl = `https://transit.land/api/v2/routing/otp/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&date=${date}&time=${time}&api_key=${apiKey}&includeWalkingItinerary=true&useFallbackDates=true&includeEarliestArrivals=true`

      console.log("🔍 Starting OTP route search...")
      console.log("API URL:", apiUrl)

      try {
        const response = await fetch(apiUrl)
        console.log("OTP API response status:", response.status)
        console.log("OTP API response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ OTP API error response:", errorText)
          throw new Error(`Failed to fetch routes: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("✅ OTP API data:", data)

        if (!data.plan || !data.plan.itineraries || data.plan.itineraries.length === 0) {
          console.warn("⚠️ No itineraries found in OTP response.")
          setError("No routes found for your search criteria.")
          setRoutes([])
          return
        }

        const transformedRoutes: TransitRoute[] = data.plan.itineraries.map(
          (itinerary: OTPItinerary, index: number) => {
            // Determine primary mode for display
            const transitLegs = itinerary.legs.filter((leg) => leg.transitLeg)
            let primaryMode = "WALK"
            if (transitLegs.length > 0) {
              const modes = new Set(transitLegs.map((leg) => leg.mode))
              primaryMode = modes.size > 1 ? "MIXED" : Array.from(modes)[0]
            }

            return {
              id: `itinerary-${index}`,
              from: fromName,
              to: toName,
              mode: primaryMode,
              price: estimatePrice(itinerary),
              duration: formatDuration(itinerary.duration),
              departure: formatTime(itinerary.startTime),
              arrival: formatTime(itinerary.endTime),
              provider: transitLegs[0]?.agencyName || "Various", // Use first transit leg's agency or 'Various'
              co2: estimateCO2(itinerary),
              transfers: itinerary.transfers,
              walkTime: formatDuration(itinerary.walkTime),
              transitTime: formatDuration(itinerary.transitTime),
              waitingTime: formatDuration(itinerary.waitingTime),
              legs: itinerary.legs, // Store full legs for dropdown
            }
          },
        )

        console.log("✅ Successfully transformed", transformedRoutes.length, "routes from OTP.")
        setRoutes(transformedRoutes)
      } catch (err) {
        console.error("💥 Error in fetchRoutes:", err)
        console.error("Error stack:", err instanceof Error ? err.stack : "No stack trace")
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setRoutes([])
      } finally {
        setLoading(false)
        console.log("🏁 OTP route fetching completed.")
      }
    }

    fetchRoutes()
  }, [fromLat, fromLon, toLat, toLon, date, time]) // Re-fetch when coordinates, date, or time change

  // Filter and sort routes (mode filter removed)
  const filteredRoutes = routes

  filteredRoutes.sort((a, b) => {
    const parseDuration = (d: string) => {
      const parts = d.match(/(\d+)h\s*(\d+)?m?/)
      if (parts) {
        const hours = Number.parseInt(parts[1] || "0")
        const minutes = Number.parseInt(parts[2] || "0")
        return hours * 60 + minutes
      }
      return Number.parseInt(d.replace("m", "")) || 0 // For "30m" format
    }
    const parseCo2 = (c: string) => Number.parseFloat(c.replace("kg", "")) || 0

    switch (sort) {
      case "duration":
        const durationA = parseDuration(a.duration)
        const durationB = parseDuration(b.duration)
        if (durationA === durationB) {
          return a.price - b.price // Secondary sort by price if durations are equal
        }
        return durationA - durationB
      case "price":
        return a.price - b.price
      case "co2":
        return parseCo2(a.co2) - parseCo2(b.co2)
      case "departure":
        return a.departure.localeCompare(b.departure)
      default:
        return 0
    }
  })

  const addToItinerary = (route: TransitRoute) => {
    console.log("➕ Adding route to itinerary:", route)
    setItinerary((prev) => [...prev, route])
  }

  const removeFromItinerary = (routeId: string) => {
    console.log("➖ Removing route from itinerary:", routeId)
    setItinerary((prev) => prev.filter((route) => route.id !== routeId))
  }

  const totalCost = itinerary.reduce((sum, route) => sum + route.price, 0)

  const exportToCSV = () => {
    if (itinerary.length === 0) {
      console.warn("⚠️ No routes in itinerary to export")
      alert("No routes in itinerary to export")
      return
    }

    console.log("📊 Exporting CSV with", itinerary.length, "routes")

    const headers = [
      "From",
      "To",
      "Transport Mode",
      "Provider",
      "Price ($)",
      "Duration",
      "Departure",
      "Arrival",
      "Transfers",
      "Walk Time",
      "Transit Time",
      "Waiting Time",
      "CO2 Emissions",
    ]
    const csvContent = [
      headers.join(","),
      ...itinerary.map((route) =>
        [
          `"${formatLocationForDisplay(route.from)}"`,
          `"${formatLocationForDisplay(route.to)}"`,
          `"${route.mode}"`,
          `"${route.provider}"`,
          route.price,
          `"${route.duration}"`,
          `"${route.departure}"`,
          `"${route.arrival}"`,
          route.transfers,
          `"${route.walkTime}"`,
          `"${route.transitTime}"`,
          `"${route.waitingTime}"`,
          `"${route.co2}"`,
        ].join(","),
      ),
    ].join("\n")

    const totalRow = `\n"Total Cost",,,,${totalCost.toFixed(2)},,,,,,,,` // Adjust columns for total row
    const finalContent = csvContent + totalRow

    console.log("📄 CSV content generated:", finalContent)

    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `travel-itinerary-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("✅ CSV export completed")
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for routes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <p className="text-gray-600">Please ensure valid locations and dates are selected.</p>
          </div>
        ) : !fromName || !toName || !date || !time ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Enter departure and destination locations, date, and time to search for routes.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {formatLocationForDisplay(fromName)} → {formatLocationForDisplay(toName)}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{filteredRoutes.length} routes found</span>
                <div className="flex items-center gap-2">
                  {" "}
                  {/* Added flex container to align label and select */}
                  <span className="text-sm font-medium text-gray-700">Sort by:</span> {/* New label */}
                  <label htmlFor="sort-by" className="sr-only">
                    Sort by
                  </label>
                  <select
                    id="sort-by"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                  >
                    <option value="duration">Duration</option>
                    <option value="price">Cost</option>
                    <option value="co2">CO2</option>
                    <option value="departure">Departure</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredRoutes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No routes found for your search criteria.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your date, time, or search different locations.
                </p>
              </div>
            ) : (
              filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{transportIcons[route.mode] || "🚌"}</span>
                      <div>
                        <div className="font-medium capitalize">{route.mode.toLowerCase().replace("_", " ")}</div>
                        <div className="text-sm text-gray-500">{route.provider}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="font-bold text-lg">${route.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">estimated</div>
                      </div>

                      <div className="text-center">
                        <div className="font-medium">{route.duration}</div>
                        <div className="text-sm text-gray-500">
                          {route.departure} - {route.arrival}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-green-600">{route.co2}</div>
                        <div className="text-xs text-gray-500">CO₂</div>
                      </div>

                      <button
                        onClick={() => addToItinerary(route)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add to Trip
                      </button>
                    </div>
                  </div>

                  {/* Dropdown for intermediate stops */}
                  {["BUS", "SUBWAY", "RAIL", "TRAM", "FERRY", "MIXED"].includes(route.mode) &&
                    route.legs.length > 0 && (
                      <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm text-blue-600 hover:underline">
                            View Details ({route.legs.length} legs, {route.transfers} transfers)
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="space-y-3 text-sm text-gray-700">
                              {route.legs.map((leg, legIndex) => (
                                <div key={legIndex} className="border-l-2 border-gray-200 pl-4 py-1">
                                  <div className="font-medium flex items-center gap-2">
                                    <span className="text-lg">{transportIcons[leg.mode] || "🚶"}</span>
                                    <span className="capitalize">{leg.mode.toLowerCase().replace("_", " ")}</span>
                                    {leg.routeShortName && (
                                      <span className="text-gray-500">({leg.routeShortName})</span>
                                    )}
                                    <span className="ml-auto text-gray-500">{formatDuration(leg.duration)}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatTime(leg.from.departure || 0)} - {formatLocationForDisplay(leg.from.name)}
                                  </div>
                                  {leg.intermediateStops && leg.intermediateStops.length > 0 && (
                                    <div className="ml-6 text-xs text-gray-500">
                                      {leg.intermediateStops.length} intermediate stops
                                      {/* You could map these out if desired, but for brevity, just showing count */}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500">
                                    {formatTime(leg.to.arrival || 0)} - {formatLocationForDisplay(leg.to.name)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Itinerary Sidebar - This is now always rendered */}
      <div className="bg-white rounded-lg p-6 shadow-sm border h-fit">
        <h3 className="text-xl font-bold mb-4">My Itinerary</h3>

        {itinerary.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No routes added yet</p>
        ) : (
          <div className="space-y-3">
            {itinerary.map((route, index) => (
              <div key={`${route.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{transportIcons[route.mode] || "🚌"}</span>
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatLocationForDisplay(route.from)} → {formatLocationForDisplay(route.to)}
                    </div>
                    <div className="text-gray-500">${route.price.toFixed(2)}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromItinerary(route.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total Cost:</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={exportToCSV}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
            >
              Export CSV
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
