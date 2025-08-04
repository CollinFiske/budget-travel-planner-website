import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Route {
  id: string
  from: string
  to: string
  mode: string
  price: number
  duration: string
  departure: string
  arrival: string
  provider: string
  co2: string
}

interface ItineraryStore {
  routes: Route[]
  addRoute: (route: Route) => void
  removeRoute: (index: number) => void
  clearItinerary: () => void
  getTotalCost: () => number
}

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      routes: [],
      addRoute: (route) =>
        set((state) => ({
          routes: [...state.routes, route],
        })),
      removeRoute: (index) =>
        set((state) => ({
          routes: state.routes.filter((_, i) => i !== index),
        })),
      clearItinerary: () => set({ routes: [] }),
      getTotalCost: () => {
        const { routes } = get()
        return routes.reduce((total, route) => total + route.price, 0)
      },
    }),
    {
      name: "itinerary-storage",
    },
  ),
)
