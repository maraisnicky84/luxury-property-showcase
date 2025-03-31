"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Phone, Mail, Check } from "lucide-react"

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-8 rounded-lg text-center"
      >
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
        <p className="text-white/80 mb-6">
          Your request has been submitted. Our luxury property specialist will contact you shortly to arrange a private
          viewing.
        </p>
        <Button onClick={() => setIsSubmitted(false)} className="w-full">
          Submit Another Request
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-white/70 mt-1" />
              <div>
                <div className="text-white/70 mb-1">Phone</div>
                <div className="text-white font-medium">+1 (800) 555-LUXE</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-white/70 mt-1" />
              <div>
                <div className="text-white/70 mb-1">Email</div>
                <div className="text-white font-medium">info@luxeestates.com</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-white/70 mt-1" />
              <div>
                <div className="text-white/70 mb-1">Office Hours</div>
                <div className="text-white font-medium">Mon-Fri: 9AM-7PM</div>
                <div className="text-white font-medium">Sat-Sun: By Appointment</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-white/70 mt-1" />
              <div>
                <div className="text-white/70 mb-1">Private Viewings</div>
                <div className="text-white font-medium">Available 7 days a week</div>
                <div className="text-white font-medium">By appointment only</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-6">Schedule a Viewing</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-white/70 block">
                  First Name
                </label>
                <Input id="firstName" required className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-white/70 block">
                  Last Name
                </label>
                <Input id="lastName" required className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-white/70 block">
                Email
              </label>
              <Input id="email" type="email" required className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-white/70 block">
                Phone
              </label>
              <Input id="phone" type="tel" required className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-white/70 block">
                Message
              </label>
              <Textarea
                id="message"
                rows={4}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Tell us about your preferred viewing time and any specific questions you have."
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

