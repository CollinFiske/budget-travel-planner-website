"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LocationSearch } from "./LocationSearch"

interface SelectedLocation {
  name: string
  lat: string
  lon: string
}

export function SearchInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(null)
  const [toLocation, setToLocation] = useState<SelectedLocation | null>(null)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("09:00") // New state for time
  // Removed mode and sort states as per request, now handled in RouteResults

  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false)

  // Load values from URL only once on mount
  useEffect(() => {
    if (!hasLoadedFromUrl) {
      const fromName = searchParams.get("fromName")
      const fromLat = searchParams.get("fromLat")
      const fromLon = searchParams.get("fromLon")
      const toName = searchParams.get("toName")
      const toLat = searchParams.get("toLat")
      const toLon = searchParams.get("toLon")
      const dateParam = searchParams.get("date")
      const timeParam = searchParams.get("time") // Load time from URL

      if (fromName && fromLat && fromLon) {
        setFromLocation({ name: fromName, lat: fromLat, lon: fromLon })
      }
      if (toName && toLat && toLon) {
        setToLocation({ name: toName, lat: toLat, lon: toLon })
      }
      if (dateParam) setDate(dateParam)
      if (timeParam) setTime(timeParam) // Set time from URL

      setHasLoadedFromUrl(true)
    }
  }, [searchParams, hasLoadedFromUrl])

  const updateSearch = () => {
    if (!fromLocation || !toLocation || !date || !time) {
      alert("Please select both locations, a date, and a time.")
      return
    }

    const params = new URLSearchParams()
    params.set("fromName", fromLocation.name)
    params.set("fromLat", fromLocation.lat)
    params.set("fromLon", fromLocation.lon)
    params.set("toName", toLocation.name)
    params.set("toLat", toLocation.lat)
    params.set("toLon", toLocation.lon)
    params.set("date", date)
    params.set("time", time) // Add time to URL params

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="grid md:grid-cols-6 gap-4">
        {" "}
        {/* Changed to 6 columns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <LocationSearch
            onSelect={setFromLocation}
            placeholder="Departure city"
            initialValue={fromLocation?.name || ""}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <LocationSearch
            onSelect={setToLocation}
            placeholder="Destination city"
            initialValue={toLocation?.name || ""}
          />
        </div>
        <div className="md:col-span-2">
          {" "}
          {/* Combined Date & Time into a single row, spanning 2 columns */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
          <div className="grid grid-cols-2 gap-2">
            {" "}
            {/* Nested grid for side-by-side */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>
        <div className="flex items-end md:col-span-2">
          {" "}
          {/* Adjusted col-span to fill remaining space */}
          <button
            onClick={updateSearch}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
