"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"
import { Calendar, Clock, Info, MapPin, Filter, Search, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { CldVideoPlayer } from 'next-cloudinary';
import { motion } from "framer-motion"
import BookingDetailsModal from "@/components/booking-details-modal"

export default function BookingsPage() {
  const { user, getUserBookings, markBookingNotificationSeen, updateBooking } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Video load handler
  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  useEffect(() => {
    // Get bookings when component mounts
    const userBookings = getUserBookings()
    setBookings(userBookings || [])
  }, [getUserBookings])

  useEffect(() => {
    // Mark notifications as seen when this page is visited
    markBookingNotificationSeen()
  }, [markBookingNotificationSeen])

  useEffect(() => {
    setFilteredBookings(() => {
      return bookings.filter((booking) => {
        const matchesSearch =
          booking.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || booking.status === statusFilter
        const matchesType = typeFilter === "all" || booking.type === typeFilter

        return matchesSearch && matchesStatus && matchesType
      })
    })
  }, [bookings, searchTerm, statusFilter, typeFilter])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">Please sign in to view your bookings.</p>
          <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  const handleCancelBooking = (id: string) => {
    updateBooking(id, { status: "cancelled" })
  }

  const handleViewDetails = (id: string) => {
    setSelectedBookingId(id)
  }

  const handleCloseModal = () => {
    setSelectedBookingId(null)
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="relative mb-12">
        <div className="absolute inset-0 overflow-hidden h-[300px] rounded-lg bg-gray-100">
          <div className={`transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <CldVideoPlayer
              width="1920"
              height="1080"
              src="luxury_property_showcase/header-video" // You'll need to replace this with your actual Cloudinary video ID
              autoPlay
              loop
              muted
              onPlay={handleVideoLoad}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute inset-0 bg-black/50 transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        
        <div className="relative z-10 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
              <p className="text-gray-200 mb-4">Manage your stays and property viewings</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 bg-white/90 hover:bg-white" onClick={() => router.push("/")}>
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Type</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="stay">Stays</SelectItem>
                <SelectItem value="viewing">Viewings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg shadow">
          <h2 className="text-xl font-medium mb-2">No bookings found</h2>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Book your first luxury stay experience"}
          </p>
          <Button onClick={() => router.push("/")}>Browse Properties</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={booking.propertyImage || "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&h=600&auto=format&fit=crop"}
                    alt={`Property - ${booking.propertyName}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  {booking.updatedAt && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-background/80">
                        Updated
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{booking.propertyName}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mt-1">
                          {booking.type === "stay" ? "Stay" : "Viewing"}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    {booking.type === "stay" ? (
                      <>
                        {booking.checkIn && booking.checkOut && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {format(new Date(booking.checkIn), "MMM d")} -{" "}
                              {format(new Date(booking.checkOut), "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Check-in: 3:00 PM, Check-out: 11:00 AM</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <Info className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                          <span>
                            {booking.guests} {booking.guests === 1 ? "guest" : "guests"},{" "}
                            {booking.checkIn &&
                              booking.checkOut &&
                              Math.ceil(
                                (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                            nights
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {booking.date && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{format(new Date(booking.date), "EEEE, MMMM d, yyyy")}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Time: {booking.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>123 Oceanview Drive</span>
                        </div>
                      </>
                    )}

                    {booking.updatedAt && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Last updated: {format(new Date(booking.updatedAt), "MMM d, yyyy h:mm a")}
                      </div>
                    )}
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking.id)}>
                    View Details
                  </Button>
                  {booking.status === "pending" && (
                    <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal bookingId={selectedBookingId} onClose={handleCloseModal} />
    </div>
  )
}
