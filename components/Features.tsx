export function Features() {
  const features = [
    {
      icon: "🔍",
      title: "Multi-Modal Search",
      description: "Compare trains, buses, flights, and car rentals all in one place",
    },
    {
      icon: "💰",
      title: "Budget-Focused",
      description: "Find the most affordable options without compromising on quality",
    },
    {
      icon: "🗺️",
      title: "Interactive Maps",
      description: "Visualize your routes and explore alternative paths",
    },
    {
      icon: "📅",
      title: "Smart Itineraries",
      description: "Build and manage your travel plans with one-click additions",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose BudgetTravel?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make budget travel planning simple, comprehensive, and smart
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
