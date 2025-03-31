"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, CalendarIcon, AlertTriangle } from "lucide-react"
import { format, isSameDay, isBefore, isEqual } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { usePropertyStatus } from "@/hooks/use-property-status"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface BookingFormProps {
  type: "stay" | "viewing"
}

export default function BookingForm({ type }: BookingFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [viewingDate, setViewingDate] = useState<Date | undefined>(undefined)
  const [viewingTime, setViewingTime] = useState<string>("")
  const [guests, setGuests] = useState<string>("2")
  const [specialRequests, setSpecialRequests] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter()
  const { user, addBooking, bookings } = useAuth()
  const { blockedDates, propertyStatus } = usePropertyStatus()

  // Check if property is available
  const isPropertyAvailable = propertyStatus.type === "available"

  // Get all booked dates from bookings
  const bookedDates = bookings
    .filter((booking) => booking.status !== "cancelled")
    .flatMap((booking) => {
      if (booking.type === "stay" && booking.checkIn && booking.checkOut) {
        // For stays, block all dates between check-in and check-out
        const dates = []
        const currentDate = new Date(booking.checkIn)
        const endDate = new Date(booking.checkOut)

        while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
          dates.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + 1)
        }

        return dates
      } else if (booking.type === "viewing" && booking.date) {
        // For viewings, just block that specific date
        return [new Date(booking.date)]
      }

      return []
    })

  // Combine booked dates with admin-blocked dates
  const unavailableDates = [...bookedDates, ...blockedDates.map((item) => item.date)]

  // Function to check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    if (!date) return false

    return unavailableDates.some((unavailableDate) => {
      if (!unavailableDate) return false
      return isSameDay(unavailableDate, date)
    })
  }

  // Function to disable dates in the calendar
  const disableDate = (date: Date) => {
    // Disable dates in the past
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
      return true
    }

    // For viewing bookings, only allow dates that don't have viewings already
    if (type === "viewing") {
      const existingViewings = bookings.filter(
        (booking) => booking.type === "viewing" && booking.status !== "cancelled",
      )

      const hasViewingOnDate = existingViewings.some(
        (booking) => booking.date && isSameDay(new Date(booking.date), date),
      )

      return hasViewingOnDate || isDateUnavailable(date)
    }

    return isDateUnavailable(date)
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to make a booking",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      if (!isPropertyAvailable) {
        toast({
          title: "Property unavailable",
          description: `This property is currently ${propertyStatus.type}. Please try again later.`,
          variant: "destructive",
        })
        return
      }

      // Check if selected dates are available
      if (type === "stay") {
        if (!checkIn || !checkOut) {
          toast({
            title: "Missing dates",
            description: "Please select both check-in and check-out dates.",
            variant: "destructive",
          })
          return
        }

        // Check all dates in the range
        const currentDate = new Date(checkIn)
        while (isBefore(currentDate, checkOut) || isEqual(currentDate, checkOut)) {
          if (isDateUnavailable(currentDate)) {
            toast({
              title: "Dates unavailable",
              description: `${format(currentDate, "MMMM d, yyyy")} is unavailable. Please choose different dates.`,
              variant: "destructive",
            })
            return
          }
          currentDate.setDate(currentDate.getDate() + 1)
        }
      } else {
        if (!viewingDate) {
          toast({
            title: "Missing date",
            description: "Please select a viewing date.",
            variant: "destructive",
          })
          return
        }

        if (isDateUnavailable(viewingDate)) {
          toast({
            title: "Date unavailable",
            description: "The selected date is unavailable for viewings. Please choose a different date.",
            variant: "destructive",
          })
          return
        }
      }

      // Create booking object
      const booking = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        status: "pending",
        createdAt: new Date(),
        userId: user?.id, // Add user ID to the booking
        propertyName: "Luxury Villa",
        propertyImage: "/images/exterior.png",
        notes: specialRequests,
        ...(type === "stay"
          ? {
              checkIn: checkIn,
              checkOut: checkOut,
              guests: Number.parseInt(guests),
            }
          : {
              date: viewingDate,
              time: viewingTime,
            }),
      }

      // Add booking to user's bookings
      addBooking(booking)

      // Show success state
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setCheckIn(undefined)
        setCheckOut(undefined)
        setViewingDate(undefined)
        setViewingTime("")
        setGuests("2")
        setSpecialRequests("")
      }, 3000)
    },
    [
      user,
      type,
      checkIn,
      checkOut,
      guests,
      viewingDate,
      viewingTime,
      specialRequests,
      toast,
      router,
      addBooking,
      isPropertyAvailable,
      propertyStatus.type,
    ],
  )

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-card p-8 rounded-lg text-center shadow-lg"
      >
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {type === "stay" ? "Booking Confirmed!" : "Viewing Scheduled!"}
        </h3>
        <p className="text-muted-foreground mb-6">
          {type === "stay"
            ? "Your luxury stay has been booked. Check your email for confirmation details."
            : "Your property viewing has been scheduled. Our team will contact you to confirm."}
        </p>
        <Button onClick={() => router.push("/bookings")} className="w-full">
          View My Bookings
        </Button>
      </motion.div>
    )
  }

  if (!isPropertyAvailable) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Property Unavailable</AlertTitle>
        <AlertDescription>
          This property is currently {propertyStatus.type}
          {propertyStatus.reason ? ` due to ${propertyStatus.reason}` : ""}. Please check back later or contact us for
          more information.
        </AlertDescription>
      </Alert>
    )
  }

  // Calculate nights and total price
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const roomPrice = nights * 1200
  const cleaningFee = 250
  const serviceFee = 180
  const totalPrice = roomPrice + cleaningFee + serviceFee

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-foreground mb-6">
          {type === "stay" ? "Book Your Stay" : "Schedule a Viewing"}
        </h3>

        <div className="space-y-6">
          {type === "stay" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Check-in Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={(date) => {
                          setCheckIn(date)
                          // If checkout date is before new checkin date, reset checkout
                          if (checkOut && date && date > checkOut) {
                            setCheckOut(undefined)
                          }
                        }}
                        disabled={(date) => {
                          // Disable dates in the past
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || isDateUnavailable(date)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Check-out Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground",
                        )}
                        disabled={!checkIn}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => {
                          // Disable dates before check-in
                          if (checkIn && date < checkIn) {
                            return true
                          }
                          return isDateUnavailable(date)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="guests" className="text-sm font-medium">
                  Number of Guests
                </label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger id="guests" className="w-full">
                    <SelectValue placeholder="Select number of guests" />
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

              <div className="space-y-2">
                <h4 className="font-medium">Price Summary</h4>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      $1,200 x {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span>${roomPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cleaning fee</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Preferred Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !viewingDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {viewingDate ? format(viewingDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={viewingDate}
                      onSelect={setViewingDate}
                      disabled={(date) => {
                        // Disable dates in the past
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || isDateUnavailable(date)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label htmlFor="viewing-time" className="text-sm font-medium">
                  Preferred Time
                </label>
                <Select value={viewingTime} onValueChange={setViewingTime}>
                  <SelectTrigger id="viewing-time" className="w-full">
                    <SelectValue placeholder="Select time" />
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
            </>
          )}

          <div className="space-y-2">
            <label htmlFor="specialRequests" className="text-sm font-medium">
              Special Requests
            </label>
            <Textarea
              id="specialRequests"
              rows={4}
              className="resize-none"
              placeholder={
                type === "stay" ? "Any special requests for your stay?" : "Any specific questions about the property?"
              }
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={type === "stay" ? !checkIn || !checkOut || !guests : !viewingDate || !viewingTime}
            >
              {type === "stay" ? "Book Now" : "Schedule Viewing"}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

