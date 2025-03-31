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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Save } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import type { Booking } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface AdminBookingEditModalProps {
  bookingId: string | null
  onClose: () => void
}

export default function AdminBookingEditModal({ bookingId, onClose }: AdminBookingEditModalProps) {
  const { bookings, updateBooking } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Find the booking by ID
  const booking = bookings.find((b) => b.id === bookingId)

  // Initialize state variables with default values
  const [status, setStatus] = useState(booking?.status || "pending")
  const [checkInStr, setCheckInStr] = useState(booking?.checkIn ? format(new Date(booking.checkIn), "yyyy-MM-dd") : "")
  const [checkOutStr, setCheckOutStr] = useState(
    booking?.checkOut ? format(new Date(booking.checkOut), "yyyy-MM-dd") : "",
  )
  const [viewingDateStr, setViewingDateStr] = useState(
    booking?.date ? format(new Date(booking.date), "yyyy-MM-dd") : "",
  )
  const [viewingTime, setViewingTime] = useState(booking?.time || "")
  const [guests, setGuests] = useState(booking?.guests?.toString() || "2")
  const [notes, setNotes] = useState(booking?.notes || "")

  if (!booking) {
    return null
  }

  // State for editable fields

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const updates: Partial<Booking> = {
        status,
        notes,
        updatedAt: new Date(),
      }

      if (booking.type === "stay") {
        updates.checkIn = checkInStr ? new Date(checkInStr + "T12:00:00") : undefined
        updates.checkOut = checkOutStr ? new Date(checkOutStr + "T12:00:00") : undefined
        updates.guests = Number(guests)
      } else {
        updates.date = viewingDateStr ? new Date(viewingDateStr + "T12:00:00") : undefined
        updates.time = viewingTime
      }

      await updateBooking(booking.id, updates)

      toast({
        title: "Booking updated",
        description: "The booking has been successfully updated.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating the booking.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Booking</DialogTitle>
          <DialogDescription>
            Make changes to the {booking.type === "stay" ? "stay" : "viewing"} booking
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Booking ID</h3>
                <Input value={booking.id} disabled className="font-mono" />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {booking.type === "stay" ? (
              <div className="space-y-4">
                <h3 className="font-medium">Stay Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-in Date
                    </label>
                    <Input type="date" value={checkInStr} onChange={(e) => setCheckInStr(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-out Date
                    </label>
                    <Input type="date" value={checkOutStr} onChange={(e) => setCheckOutStr(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium">Viewing Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Viewing Date
                    </label>
                    <Input type="date" value={viewingDateStr} onChange={(e) => setViewingDateStr(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Viewing Time
                    </label>
                    <Select value={viewingTime} onValueChange={setViewingTime}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add any notes or special requests"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="ml-2">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

