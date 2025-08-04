import { Suspense } from "react"
import { SearchInterface } from "@/components/SearchInterface"
import { RouteResults } from "@/components/RouteResults"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">BudgetTravel</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <SearchInterface />
          <div className="mt-8">
            <RouteResults />
          </div>
        </Suspense>
      </main>
    </div>
  )
}
