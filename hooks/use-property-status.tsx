"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type BlockedDate = {
  date: Date
  reason: string
  note?: string
}

type PropertyStatus = {
  type: "available" | "renovation" | "maintenance" | "seasonal-closure" | "private-use"
  reason?: string
  updatedAt?: Date
}

type PropertyStatusContextType = {
  blockedDates: BlockedDate[]
  addBlockedDate: (date: BlockedDate) => void
  removeBlockedDate: (index: number) => void
  propertyStatus: PropertyStatus
  updatePropertyStatus: (status: PropertyStatus) => void
}

const PropertyStatusContext = createContext<PropertyStatusContextType | undefined>(undefined)

export function PropertyStatusProvider({ children }: { children: React.ReactNode }) {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [propertyStatus, setPropertyStatus] = useState<PropertyStatus>({
    type: "available",
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const storedBlockedDates = localStorage.getItem("blockedDates")
    const storedPropertyStatus = localStorage.getItem("propertyStatus")

    if (storedBlockedDates) {
      try {
        const parsedDates = JSON.parse(storedBlockedDates)
        // Convert string dates back to Date objects
        const datesWithDateObjects = parsedDates.map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }))
        setBlockedDates(datesWithDateObjects)
      } catch (error) {
        console.error("Failed to parse stored blocked dates:", error)
        localStorage.removeItem("blockedDates")
      }
    }

    if (storedPropertyStatus) {
      try {
        const parsedStatus = JSON.parse(storedPropertyStatus)
        // Convert string date back to Date object if it exists
        setPropertyStatus({
          ...parsedStatus,
          updatedAt: parsedStatus.updatedAt ? new Date(parsedStatus.updatedAt) : undefined,
        })
      } catch (error) {
        console.error("Failed to parse stored property status:", error)
        localStorage.removeItem("propertyStatus")
      }
    }
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("blockedDates", JSON.stringify(blockedDates))
  }, [blockedDates])

  useEffect(() => {
    localStorage.setItem("propertyStatus", JSON.stringify(propertyStatus))
  }, [propertyStatus])

  const addBlockedDate = (date: BlockedDate) => {
    setBlockedDates((prev) => [...prev, date])
  }

  const removeBlockedDate = (index: number) => {
    setBlockedDates((prev) => prev.filter((_, i) => i !== index))
  }

  const updatePropertyStatus = (status: PropertyStatus) => {
    setPropertyStatus(status)
  }

  return (
    <PropertyStatusContext.Provider
      value={{
        blockedDates,
        addBlockedDate,
        removeBlockedDate,
        propertyStatus,
        updatePropertyStatus,
      }}
    >
      {children}
    </PropertyStatusContext.Provider>
  )
}

export function usePropertyStatus() {
  const context = useContext(PropertyStatusContext)
  if (context === undefined) {
    throw new Error("usePropertyStatus must be used within a PropertyStatusProvider")
  }
  return context
}

