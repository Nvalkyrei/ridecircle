"use client"

import { useState } from "react"
import { SearchFilters } from "./search-filters"
import { SearchResults } from "./search-results"

interface SearchParams {
  city: string
  pickupDate: string
  dropoffDate: string
  pickupTime: string
  dropoffTime: string
  carType: string
  transmission: string
  fuelType: string
  priceRange: [number, number]
  features: string[]
  sortBy: string
}

const initialSearchParams: SearchParams = {
  city: "",
  pickupDate: "",
  dropoffDate: "",
  pickupTime: "10:00",
  dropoffTime: "10:00",
  carType: "",
  transmission: "",
  fuelType: "",
  priceRange: [500, 5000],
  features: [],
  sortBy: "relevance",
}

export function SearchInterface() {
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate search API call
    setTimeout(() => {
      setIsSearching(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Find Your Perfect Ride</h2>
          <p className="text-muted-foreground">Search from thousands of verified cars across India</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              searchParams={searchParams}
              onSearchParamsChange={setSearchParams}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <SearchResults
              searchParams={searchParams}
              onSortChange={(sortBy) => setSearchParams({ ...searchParams, sortBy })}
              isSearching={isSearching}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
