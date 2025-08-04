"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real app, you would initialize Leaflet here
    // For now, we'll show a placeholder
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <div class="text-gray-500 mb-2">Interactive Map</div>
            <div class="text-sm text-gray-400">Route visualization will appear here</div>
          </div>
        </div>
      `
    }
  }, [])

  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle>Route Map</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div ref={mapRef} className="w-full h-full" />
      </CardContent>
    </Card>
  )
}
