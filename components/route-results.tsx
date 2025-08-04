"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Train, Bus, Car, Plus } from "lucide-react"
import { useItineraryStore } from "@/lib/store"

// Mock data - in real app, this would come from APIs
const mockRoutes = [
  {
    id: "1",
    from: "New York",
    to: "Boston",
    mode: "train",
    price: 45,
    duration: "3h 45m",
    departure: "08:30",
    arrival: "12:15",
    provider: "Amtrak",
    co2: "22kg",
  },
  {
    id: "2",
    from: "New York",
    to: "Boston",
    mode: "bus",
    price: 25,
    duration: "4h 30m",
    departure: "09:00",
    arrival: "13:30",
    provider: "Greyhound",
    co2: "18kg",
  },
  {
    id: "3",
    from: "New York",
    to: "Boston",
    mode: "flight",
    price: 120,
    duration: "1h 30m",
    departure: "10:15",
    arrival: "11:45",
    provider: "JetBlue",
    co2: "85kg",
  },
  {
    id: "4",
    from: "New York",
    to: "Boston",
    mode: "car",
    price: 35,
    duration: "4h 15m",
    departure: "Flexible",
    arrival: "Flexible",
    provider: "Rental Car",
    co2: "45kg",
  },
]

const transportIcons = {
  train: Train,
  bus: Bus,
  flight: Plane,
  car: Car,
}

export function RouteResults() {
  const searchParams = useSearchParams()
  const addToItinerary = useItineraryStore((state) => state.addRoute)

  const from = searchParams.get("from") || "New York"
  const to = searchParams.get("to") || "Boston"
  const mode = searchParams.get("mode") || "all"
  const sortBy = searchParams.get("sort") || "price"

  // Filter and sort routes based on search params
  const filteredRoutes = mockRoutes.filter((route) => mode === "all" || route.mode === mode)

  filteredRoutes.sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "duration":
        return Number.parseInt(a.duration) - Number.parseInt(b.duration)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {from} → {to}
        </h2>
        <Badge variant="secondary">{filteredRoutes.length} routes found</Badge>
      </div>

      {filteredRoutes.map((route) => {
        const Icon = transportIcons[route.mode as keyof typeof transportIcons]

        return (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium capitalize">{route.mode}</span>
                  </div>
                  <Badge variant="outline">{route.provider}</Badge>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="font-bold text-lg">${route.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
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

                  <Button onClick={() => addToItinerary(route)} className="flex items-center space-x-1">
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
