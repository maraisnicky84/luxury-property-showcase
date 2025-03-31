"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"
import { Calendar, User, Check, X, MoreHorizontal, Search, Filter, BarChart3, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BookingDetailsModal from "@/components/booking-details-modal"

export default function AdminPage() {
  const { user, bookings, updateBooking } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setFilteredBookings(
      bookings.filter((booking) => {
        const matchesSearch =
          booking.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || booking.status === statusFilter
        const matchesType = typeFilter === "all" || booking.type === typeFilter

        return matchesSearch && matchesStatus && matchesType
      }),
    )
  }, [bookings, searchTerm, statusFilter, typeFilter])

  const handleUpdateStatus = (id: string, status: "confirmed" | "cancelled") => {
    updateBooking(id, { status })

    toast({
      title: `Booking ${status}`,
      description: `The booking has been ${status}.`,
    })
  }

  const handleViewDetails = (id: string) => {
    setSelectedBookingId(id)
  }

  const handleCloseModal = () => {
    setSelectedBookingId(null)
  }

  // Stats for dashboard
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length
  const stayBookings = bookings.filter((b) => b.type === "stay").length
  const viewingBookings = bookings.filter((b) => b.type === "viewing").length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings and property viewings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stayBookings} stays, {viewingBookings} viewings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingBookings}</div>
            <div className="text-xs text-muted-foreground mt-1">Require confirmation</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{confirmedBookings}</div>
            <div className="text-xs text-muted-foreground mt-1">Successfully confirmed</div>
          </CardContent>
        </Card>
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

      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-muted-foreground">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Property</th>
                  <th className="text-left p-4">Guest</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{booking.id}</td>
                    <td className="p-4">{booking.propertyName}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>John Doe</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{booking.type === "stay" ? "Stay" : "Viewing"}</Badge>
                    </td>
                    <td className="p-4">
                      {booking.type === "stay"
                        ? booking.checkIn &&
                          booking.checkOut && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {format(new Date(booking.checkIn), "MMM d")} -{" "}
                                {format(new Date(booking.checkOut), "MMM d, yyyy")}
                              </span>
                            </div>
                          )
                        : booking.date && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{format(new Date(booking.date), "MMM d, yyyy")}</span>
                            </div>
                          )}
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {format(new Date(booking.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(booking.id)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "confirmed")}>
                            <Check className="h-4 w-4 mr-2" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, "cancelled")}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal bookingId={selectedBookingId} onClose={handleCloseModal} isAdmin={true} />
    </div>
  )
}

