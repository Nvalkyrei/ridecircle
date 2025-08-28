import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16 pb-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find the perfect car for your next adventure
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Book amazing cars shared by local hosts. Skip the rental counter and unlock unique driving experiences.
              </p>

              <div className="bg-white rounded-2xl shadow-xl border p-6 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Where
                    </label>
                    <Input
                      placeholder="City or airport"
                      className="border-0 bg-gray-50 text-lg h-12"
                      defaultValue="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      From
                    </label>
                    <Input type="date" className="border-0 bg-gray-50 text-lg h-12" defaultValue="2024-12-25" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Until
                    </label>
                    <Input type="date" className="border-0 bg-gray-50 text-lg h-12" defaultValue="2024-12-28" />
                  </div>
                </div>
                <Link href="/search">
                  <Button className="w-full mt-6 h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700">
                    Search cars
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular cars near you</h2>
            <p className="text-lg text-gray-600">Discover highly rated cars in Mumbai</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Honda City",
                price: "₹2,500",
                rating: "4.9",
                image: "/honda-city-silver.png",
                trips: "120+ trips",
                location: "Bandra West",
              },
              {
                name: "Maruti Swift",
                price: "₹1,800",
                rating: "4.8",
                image: "/red-swift.png",
                trips: "85+ trips",
                location: "Andheri East",
              },
              {
                name: "Hyundai Creta",
                price: "₹3,200",
                rating: "4.9",
                image: "/hyundai-creta-white-suv.png",
                trips: "95+ trips",
                location: "Powai",
              },
            ].map((car, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
                      <p className="text-sm text-gray-500">{car.location}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{car.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{car.trips}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">
                      {car.price}
                      <span className="text-sm font-normal text-gray-500">/day</span>
                    </p>
                    <Link href={`/cars/${index + 1}`}>
                      <Button size="sm" variant="outline">
                        View details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/search">
              <Button variant="outline" size="lg" className="font-medium bg-transparent">
                View all cars
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">50K+</div>
              <p className="text-gray-600">Happy customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.8★</div>
              <p className="text-gray-600">Average rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">2000+</div>
              <p className="text-gray-600">Support garages</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to earn money sharing your car?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of hosts earning extra income by sharing their cars on Ride Circle.
          </p>
          <Link href="/host/dashboard">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
              Become a host
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
