"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, Share, Calendar } from "lucide-react"
import { useItineraryStore } from "@/lib/store"

export function ItineraryManager() {
  const { routes, removeRoute, clearItinerary, getTotalCost } = useItineraryStore()

  if (routes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No routes in your itinerary</h3>
          <p className="text-gray-500 mb-4">Start by searching for routes and adding them to your itinerary.</p>
          <Button>Search Routes</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Itinerary</h2>
          <p className="text-gray-600">Total cost: ${getTotalCost()}</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={clearItinerary}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {routes.map((route, index) => (
          <Card key={`${route.id}-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <Badge variant="outline" className="capitalize">
                      {route.mode}
                    </Badge>
                    <span className="font-medium">
                      {route.from} → {route.to}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{route.provider}</span>
                    <span>{route.duration}</span>
                    <span>
                      {route.departure} - {route.arrival}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-lg">${route.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => removeRoute(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
