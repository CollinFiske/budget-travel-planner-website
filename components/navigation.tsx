"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Route } from "lucide-react"

export function Navigation() {
  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Route className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">BudgetTravel</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/search" className="text-gray-600 hover:text-gray-900">
            Search Routes
          </Link>
          <Link href="/itinerary" className="text-gray-600 hover:text-gray-900">
            My Itinerary
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </nav>
  )
}
