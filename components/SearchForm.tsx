"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LocationSearch } from "./LocationSearch"

interface SelectedLocation {
  name: string
  lat: string
  lon: string
}

export function SearchForm() {
  const router = useRouter()
  const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(null)
  const [toLocation, setToLocation] = useState<SelectedLocation | null>(null)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("09:00") // New state for time, default to 09:00

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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
    <div className="bg-white rounded-lg p-6 shadow-xl max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <LocationSearch
            onSelect={setFromLocation}
            placeholder="Departure city"
            initialValue={fromLocation?.name || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <LocationSearch
            onSelect={setToLocation}
            placeholder="Destination city"
            initialValue={toLocation?.name || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>

        <div className="md:col-span-4 flex justify-center">
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Search Routes
          </button>
        </div>
      </form>
    </div>
  )
}
