import { SearchForm } from "@/components/SearchForm"
import { Features } from "@/components/Features"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">BudgetTravel</h1>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Travel Smart, Spend Less</h1>
            <p className="text-xl mb-12 opacity-90">
              Compare routes across trains, buses, flights, and more. Find the best budget-friendly options.
            </p>
            <SearchForm />
          </div>
        </section>

        <Features />
      </main>
    </div>
  )
}
