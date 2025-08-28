import { SearchInterface } from "@/components/search/search-interface"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary"></div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Ride Circle</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
                My Profile
              </a>
              <a href="/customer/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                My Bookings
              </a>
              <div className="h-8 w-8 rounded-full bg-muted"></div>
            </nav>
          </div>
        </div>
      </header>

      <SearchInterface />
    </div>
  )
}
