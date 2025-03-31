"use client"

import { useState } from "react"
import { CalendarIcon, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { usePropertyStatus } from "@/hooks/use-property-status"
import { useAuth } from "@/hooks/use-auth"
import { format, isSameDay } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function AvailabilityPage() {
  const { toast } = useToast()
  const { bookings } = useAuth()
  const { blockedDates, addBlockedDate, removeBlockedDate, propertyStatus, updatePropertyStatus } = usePropertyStatus()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [blockReason, setBlockReason] = useState("maintenance")
  const [blockNote, setBlockNote] = useState("")
  const [propertyStatusReason, setPropertyStatusReason] = useState(propertyStatus.reason || "")
  const [propertyStatusType, setPropertyStatusType] = useState(propertyStatus.type || "available")

  // Get all booked dates from bookings
  const bookedDates = bookings.flatMap((booking) => {
    if (booking.status === "cancelled") return []

    if (booking.type === "stay" && booking.checkIn && booking.checkOut) {
      // For stays, block all dates between check-in and check-out
      const dates = []
      const currentDate = new Date(booking.checkIn)
      const endDate = new Date(booking.checkOut)

      while (currentDate <= endDate) {
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

  const handleBlockDate = () => {
    if (!selectedDate) return

    addBlockedDate({
      date: selectedDate,
      reason: blockReason,
      note: blockNote,
    })

    toast({
      title: "Date blocked",
      description: `${format(selectedDate, "MMMM d, yyyy")} has been blocked for ${blockReason}.`,
    })

    setSelectedDate(undefined)
    setBlockNote("")
  }

  const handleUpdatePropertyStatus = () => {
    updatePropertyStatus({
      type: propertyStatusType,
      reason: propertyStatusReason,
      updatedAt: new Date(),
    })

    toast({
      title: "Property status updated",
      description: `The property is now marked as ${propertyStatusType}.`,
    })
  }

  // Function to disable dates in the calendar
  const isDateUnavailable = (date: Date) => {
    if (!date) return false

    // Check if date is in bookedDates
    return bookedDates.some((bookedDate) => {
      if (!bookedDate) return false
      return isSameDay(bookedDate, date)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Manage Availability</h1>
      <p className="text-muted-foreground mb-8">Control property availability and block dates</p>

      {propertyStatus.type !== "available" && (
        <Alert className="mb-8" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Property Unavailable</AlertTitle>
          <AlertDescription>
            This property is currently marked as {propertyStatus.type} due to {propertyStatus.reason}. Users will not be
            able to make bookings.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="dates">
        <TabsList className="mb-8">
          <TabsTrigger value="dates">Block Specific Dates</TabsTrigger>
          <TabsTrigger value="property">Property Status</TabsTrigger>
        </TabsList>

        <TabsContent value="dates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Select Dates to Block</CardTitle>
                <CardDescription>Block specific dates to prevent bookings or viewings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Select Date to Block
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            // Don't disable past dates for admin
                            return false
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Select value={blockReason} onValueChange={setBlockReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="private-event">Private Event</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add notes about this block (optional)"
                      value={blockNote}
                      onChange={(e) => setBlockNote(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleBlockDate} disabled={!selectedDate} className="w-full">
                  Block Selected Date
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blocked Dates</CardTitle>
                <CardDescription>Manage dates that are currently blocked</CardDescription>
              </CardHeader>
              <CardContent>
                {blockedDates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No dates are currently blocked</div>
                ) : (
                  <div className="space-y-4">
                    {blockedDates.map((blockedDate, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{format(blockedDate.date, "MMMM d, yyyy")}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline">{blockedDate.reason}</Badge>
                            {blockedDate.note && (
                              <span className="text-xs text-muted-foreground ml-2">{blockedDate.note}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeBlockedDate(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="property">
          <Card>
            <CardHeader>
              <CardTitle>Property Availability Status</CardTitle>
              <CardDescription>Set the overall availability status for the property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={propertyStatusType} onValueChange={setPropertyStatusType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="renovation">Under Renovation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="seasonal-closure">Seasonal Closure</SelectItem>
                      <SelectItem value="private-use">Private Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason / Notes</label>
                  <Textarea
                    placeholder="Provide details about the status change"
                    value={propertyStatusReason}
                    onChange={(e) => setPropertyStatusReason(e.target.value)}
                  />
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Setting the property as unavailable will prevent all users from making new bookings until the status
                    is changed back to available.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdatePropertyStatus}
                className="w-full"
                variant={propertyStatusType !== "available" ? "destructive" : "default"}
              >
                Update Property Status
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

