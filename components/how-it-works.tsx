import { Badge } from "@/components/ui/badge"
import { Search, ContrastIcon as Compare, Plus } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search Routes",
    description: "Enter your departure and destination cities with travel dates",
  },
  {
    icon: Compare,
    title: "Compare Options",
    description: "View side-by-side comparisons of price, duration, and comfort",
  },
  {
    icon: Plus,
    title: "Build Itinerary",
    description: "Add your preferred routes to create a complete travel plan",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Plan your perfect budget trip in three simple steps</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="secondary" className="mb-2">
                    Step {index + 1}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <div className="w-full h-0.5 bg-gray-200 relative">
                      <div className="absolute right-0 top-0 w-2 h-2 bg-gray-400 rounded-full transform translate-x-1 -translate-y-0.75"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
