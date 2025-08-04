"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin } from "lucide-react"
import { format, parse } from "date-fns"

export function SearchInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState<Date>()
  const [transportMode, setTransportMode] = useState("all")
  const [sortBy, setSortBy] = useState("price")

  // Load values from URL on mount
  useEffect(() => {
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const dateParam = searchParams.get("date")

    if (fromParam) setFrom(fromParam)
    if (toParam) setTo(toParam)
    if (dateParam) {
      try {
        setDate(parse(dateParam, "yyyy-MM-dd", new Date()))
      } catch (error) {
        console.error("Invalid date format:", error)
      }
    }
  }, [searchParams])

  const updateSearch = () => {
    const params = new URLSearchParams()
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    if (transportMode !== "all") params.set("mode", transportMode)
    if (sortBy !== "price") params.set("sort", sortBy)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} className="pl-9" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} className="pl-9" />
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM dd") : "Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Select value={transportMode} onValueChange={setTransportMode}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="flight">Flights</SelectItem>
              <SelectItem value="train">Trains</SelectItem>
              <SelectItem value="bus">Buses</SelectItem>
              <SelectItem value="car">Car</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="departure">Departure</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={updateSearch}>Update Search</Button>
        </div>
      </div>
    </div>
  )
}
