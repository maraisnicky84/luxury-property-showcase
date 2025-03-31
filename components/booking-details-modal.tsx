"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Home, CreditCard, MessageSquare, Edit } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import AdminBookingEditModal from "./admin-booking-edit-modal"

interface BookingDetailsModalProps {
  bookingId: string | null
  onClose: () => void
  isAdmin?: boolean
}

export default function BookingDetailsModal({ bookingId, onClose, isAdmin = false }: BookingDetailsModalProps) {
  const { bookings, updateBooking } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Find the booking by ID
  const booking = bookings.find((b) => b.id === bookingId)

  if (!booking) {
    return null
  }

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      await updateBooking(booking.id, { status: "cancelled" })
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return format(new Date(date), "EEEE, MMMM d, yyyy")
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }

  return (
    <>
      <Dialog open={!!bookingId && !showEditModal} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Booking Details</DialogTitle>
            <DialogDescription>
              View the details of your {booking.type === "stay" ? "stay" : "viewing"} booking
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-2 space-y-4">
              <div className="relative h-48 rounded-md overflow-hidden">
                <Image
                  src={booking.propertyImage || "/placeholder.svg"}
                  alt={booking.propertyName}
                  fill
                  className="object-cover"
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
              </div>

              <div>
                <h3 className="text-xl font-semibold">{booking.propertyName}</h3>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>123 Oceanview Drive, Malibu</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Booking Information</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{booking.type === "stay" ? "Stay Dates" : "Viewing Date"}</p>
                      {booking.type === "stay" ? (
                        <p className="text-muted-foreground">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">{formatDate(booking.date)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{booking.type === "stay" ? "Check-in/out Time" : "Viewing Time"}</p>
                      {booking.type === "stay" ? (
                        <p className="text-muted-foreground">Check-in: 3:00 PM, Check-out: 11:00 AM</p>
                      ) : (
                        <p className="text-muted-foreground">{booking.time || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  {booking.type === "stay" && (
                    <>
                      <div className="flex items-start gap-2">
                        <User className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Guests</p>
                          <p className="text-muted-foreground">
                            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Home className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-muted-foreground">
                            {booking.checkIn && booking.checkOut
                              ? Math.ceil(
                                  (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )
                              : 0}{" "}
                            nights
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {booking.type === "stay" && (
                <>
                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Payment Details</h4>

                    <div className="flex items-start gap-2">
                      <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Payment Status</p>
                        <p className="text-muted-foreground">
                          {booking.status === "confirmed" ? "Paid in full" : "Pending payment"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between py-1">
                        <span>Room rate</span>
                        <span>
                          $1,200 ×{" "}
                          {booking.checkIn && booking.checkOut
                            ? Math.ceil(
                                (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )
                            : 0}{" "}
                          nights
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Cleaning fee</span>
                        <span>$250</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Service fee</span>
                        <span>$180</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>
                          $
                          {booking.checkIn && booking.checkOut
                            ? 1200 *
                                Math.ceil(
                                  (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                ) +
                              250 +
                              180
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {booking.notes && (
                <>
                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Special Requests</h4>

                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">{booking.notes}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Booking Summary</h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking ID</span>
                    <span className="font-mono">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Type</span>
                    <span>{booking.type === "stay" ? "Stay" : "Viewing"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span>{format(new Date(booking.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  {booking.updatedAt && (
                    <div className="flex justify-between">
                      <span>Last Updated</span>
                      <span>{format(new Date(booking.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>

              {isAdmin ? (
                <Button variant="outline" className="w-full" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Booking
                </Button>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-medium">Need Help?</h4>
                  <p className="text-sm text-muted-foreground">
                    If you have any questions about your booking, please contact our customer service team.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              )}

              {booking.status === "pending" && (
                <Button variant="destructive" className="w-full" onClick={handleCancel} disabled={isLoading}>
                  {isLoading ? "Cancelling..." : "Cancel Booking"}
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Edit Modal */}
      {isAdmin && showEditModal && <AdminBookingEditModal bookingId={bookingId} onClose={handleCloseEditModal} />}
    </>
  )
}

