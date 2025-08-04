"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: string
}

interface SelectedLocation {
  name: string
  lat: string
  lon: string
}

interface LocationSearchProps {
  initialValue?: string // For initial display from URL
  onSelect: (suggestion: SelectedLocation | null) => void // Callback for selection
  placeholder?: string
}

export function LocationSearch({ initialValue, onSelect, placeholder }: LocationSearchProps) {
  const [inputText, setInputText] = useState(initialValue || "")
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Update internal text if initialValue changes (e.g., from URL params)
  useEffect(() => {
    if (initialValue !== inputText) {
      setInputText(initialValue || "")
    }
  }, [initialValue])

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=5&addressdetails=1&countrycodes=us,ca,gb,fr,de,it,es,nl,be,ch,at,pt,ie,dk,se,no,fi,pl,cz,hu,sk,si,hr,bg,ro,gr,cy,mt,lu,lv,lt,ee`,
      )

      if (response.ok) {
        const data: LocationSuggestion[] = await response.json()
        setSuggestions(data)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputText(newValue)
    onSelect(null) // Clear selected location if user types

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce the API call
    debounceRef.current = setTimeout(() => {
      searchLocations(newValue)
    }, 300)
  }

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    // Set input text to the full display name
    setInputText(suggestion.display_name)
    onSelect({
      name: suggestion.display_name, // Pass full display name
      lat: suggestion.lat,
      lon: suggestion.lon,
    }) // Pass full selected location object
    setShowSuggestions(false)
    setSuggestions([])
  }

  const formatDisplayName = (displayName: string) => {
    // Show city, state/region, country for better context in the dropdown
    const parts = displayName.split(",")
    if (parts.length >= 3) {
      return `${parts[0].trim()}, ${parts[1].trim()}, ${parts[parts.length - 1].trim()}`
    }
    return displayName
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900">{formatDisplayName(suggestion.display_name)}</div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isLoading && inputText.length >= 3 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="px-3 py-2 text-sm text-gray-500">No locations found</div>
        </div>
      )}
    </div>
  )
}
