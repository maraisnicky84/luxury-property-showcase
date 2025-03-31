"use client"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default function ViewingsPage() {
  const { user, bookings } = useAuth()
  const router = useRouter()

  const viewingBookings = bookings.filter((booking) => booking.type === "viewing")

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">Please sign in to view your scheduled property viewings.</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-2">My Property Viewings</h1>
      <p className="text-muted-foreground mb-8">Manage your scheduled property viewings</p>

      {viewingBookings.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No viewings scheduled</h2>
          <p className="text-muted-foreground mb-6">Schedule a viewing to see our properties in person</p>
          <Button onClick={() => router.push("/")}>Schedule Viewing</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewingBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>Property Viewing</CardTitle>
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
                <CardDescription>
                  {booking.date && (
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(booking.date, "EEEE, MMMM d, yyyy")}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Time: {booking.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Luxury Villa, 123 Oceanview Drive</span>
                  </div>

                  {booking.notes && (
                    <div className="text-sm mt-2 p-2 bg-muted rounded-md">
                      <p className="font-medium mb-1">Notes:</p>
                      <p className="text-muted-foreground">{booking.notes}</p>
                    </div>
                  )}

                  {booking.updatedAt && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Last updated: {format(booking.updatedAt, "MMM d, yyyy h:mm a")}
                    </div>
                  )}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {booking.status === "pending" && (
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

