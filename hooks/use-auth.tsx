"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: string
  name: string
  email: string
  phone?: string
  isAdmin: boolean
  hasNotifications: boolean
  hasBookingUpdates: boolean
}

export type Booking = {
  id: string
  type: "stay" | "viewing"
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
  checkIn?: Date
  checkOut?: Date
  guests?: number
  date?: Date
  time?: string
  updatedAt?: Date
  notes?: string
  propertyName: string
  propertyImage: string
  userId?: string // Associate booking with current user
}

type AuthContextType = {
  user: User | null
  bookings: Booking[]
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  markBookingNotificationSeen: () => void
  loading: boolean
  getUserBookings: () => Booking[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    password: "password", // In a real app, this would be hashed
    phone: "+1 (555) 123-4567",
    isAdmin: false,
    hasNotifications: false,
    hasBookingUpdates: false,
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin", // In a real app, this would be hashed
    phone: "+1 (555) 987-6543",
    isAdmin: true,
    hasNotifications: false,
    hasBookingUpdates: false,
  },
]

// Mock properties
const properties = [
  {
    id: "prop1",
    name: "Luxury Villa",
    image: "/images/exterior.png",
  },
  {
    id: "prop2",
    name: "Modern Retreat",
    image: "/images/pool-view.png",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedBookings = localStorage.getItem("bookings")

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }

    if (storedBookings) {
      try {
        const parsedBookings = JSON.parse(storedBookings)
        // Convert string dates back to Date objects
        const bookingsWithDates = parsedBookings.map((booking: any) => ({
          ...booking,
          createdAt: new Date(booking.createdAt),
          updatedAt: booking.updatedAt ? new Date(booking.updatedAt) : undefined,
          checkIn: booking.checkIn ? new Date(booking.checkIn) : undefined,
          checkOut: booking.checkOut ? new Date(booking.checkOut) : undefined,
          date: booking.date ? new Date(booking.date) : undefined,
        }))
        setBookings(bookingsWithDates)
      } catch (error) {
        console.error("Failed to parse stored bookings:", error)
        localStorage.removeItem("bookings")
      }
    }

    setLoading(false)
  }, [])

  // Save user and bookings to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem("bookings", JSON.stringify(bookings))
    }
  }, [bookings])

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser({
        ...userWithoutPassword,
        hasNotifications: false,
        hasBookingUpdates: false,
      })

      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${foundUser.name}`,
      })

      return true
    }

    toast({
      title: "Sign in failed",
      description: "Invalid email or password",
      variant: "destructive",
    })

    return false
  }

  // Register function
  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive",
      })
      return false
    }

    // In a real app, this would add the user to the database
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      password, // In a real app, this would be hashed
      isAdmin: false,
      hasNotifications: false,
      hasBookingUpdates: false,
    }

    // Add to mock users (this would be a database operation in a real app)
    mockUsers.push(newUser)

    // Log the user in
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)

    toast({
      title: "Registration successful",
      description: "Your account has been created",
    })

    return true
  }

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!user) return false

    // Update the user in the mock database
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex >= 0) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
      }
    }

    // Update the current user state
    setUser({
      ...user,
      ...updates,
    })

    return true
  }

  // Sign out function
  const signOut = () => {
    setUser(null)
    toast({
      title: "Signed out successfully",
      description: "You have been signed out",
    })
  }

  // Add a new booking
  const addBooking = (booking: Booking) => {
    const newBooking = {
      ...booking,
      userId: user?.id, // Associate booking with current user
      propertyName: booking.propertyName || properties[Math.floor(Math.random() * properties.length)].name,
      propertyImage: booking.propertyImage || properties[Math.floor(Math.random() * properties.length)].image,
    }

    setBookings((prev) => [...prev, newBooking])

    toast({
      title: booking.type === "stay" ? "Stay booked successfully" : "Viewing scheduled successfully",
      description:
        booking.type === "stay" ? "Your luxury stay has been booked" : "Your property viewing has been scheduled",
    })
  }

  // Update an existing booking
  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              ...updates,
              updatedAt: new Date(),
            }
          : booking,
      ),
    )

    // Set notification flags
    if (user) {
      setUser({
        ...user,
        hasNotifications: true,
        hasBookingUpdates: true,
      })
    }

    toast({
      title: "Booking updated",
      description: `Your booking status is now ${updates.status}`,
    })
  }

  // Mark booking notifications as seen
  const markBookingNotificationSeen = useCallback(() => {
    if (user && (user.hasBookingUpdates || user.hasNotifications)) {
      setUser({
        ...user,
        hasBookingUpdates: false,
        hasNotifications: user.hasBookingUpdates ? false : user.hasNotifications,
      })
    }
  }, [user])

  // In the useAuth hook, add a function to get user-specific bookings
  const getUserBookings = useCallback(() => {
    if (!user) return []

    // If user is admin, return all bookings
    if (user.isAdmin) {
      return bookings
    }

    // Otherwise, return only the user's bookings
    return bookings.filter((booking) => booking.userId === user.id)
  }, [user, bookings])

  return (
    <AuthContext.Provider
      value={{
        user,
        bookings,
        signIn,
        signOut,
        register,
        addBooking,
        updateBooking,
        updateProfile,
        markBookingNotificationSeen,
        loading,
        getUserBookings, // Add this new function
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

