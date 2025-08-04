import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Route, DollarSign, Map, Calendar } from "lucide-react"

const features = [
  {
    icon: Route,
    title: "Multi-Modal Search",
    description: "Compare trains, buses, flights, and car rentals all in one place",
  },
  {
    icon: DollarSign,
    title: "Budget-Focused",
    description: "Find the most affordable options without compromising on quality",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Visualize your routes and explore alternative paths",
  },
  {
    icon: Calendar,
    title: "Smart Itineraries",
    description: "Build and manage your travel plans with one-click additions",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose BudgetTravel?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make budget travel planning simple, comprehensive, and smart
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
