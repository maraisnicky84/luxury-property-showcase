"use client"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingForm from "@/components/booking-form"
import Image from "next/image"

export default function BookPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Book Your Luxury Stay</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reserve your dates for an unforgettable experience in this exclusive property.
            </p>
          </motion.div>

          {/* Property Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative aspect-[21/9]">
              <Image src="/images/exterior.png" alt="Luxury property exterior" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h2 className="text-2xl font-bold">Luxury Villa</h2>
                  <p className="text-white/80">Oceanview Drive, Malibu</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Property Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-foreground mb-3">Luxury Amenities</h3>
              <p className="text-muted-foreground">
                Infinity pool, spa, home theater, wine cellar, and gourmet kitchen with top-of-the-line appliances.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-foreground mb-3">Prime Location</h3>
              <p className="text-muted-foreground">
                Nestled in an exclusive neighborhood with private beach access and stunning ocean views.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-foreground mb-3">Personalized Service</h3>
              <p className="text-muted-foreground">
                Optional concierge, private chef, and housekeeping services available upon request.
              </p>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs defaultValue="stay" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="stay">Book a Stay</TabsTrigger>
                <TabsTrigger value="viewing">Schedule a Viewing</TabsTrigger>
              </TabsList>
              <TabsContent value="stay">
                <BookingForm type="stay" />
              </TabsContent>
              <TabsContent value="viewing">
                <BookingForm type="viewing" />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

