import { ItineraryManager } from "@/components/itinerary-manager"

export default function ItineraryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Travel Itinerary</h1>
        <ItineraryManager />
      </div>
    </div>
  )
}
