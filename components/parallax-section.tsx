"use client"

import type React from "react"

import { forwardRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface ParallaxSectionProps {
  bgImage: string
  title: string
  subtitle: string
  children: React.ReactNode
}

const ParallaxSection = forwardRef<HTMLElement, ParallaxSectionProps>(({ bgImage, title, subtitle, children }, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])

  return (
    <section
      ref={(node) => {
        // Handle both refs
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
        if (sectionRef.current !== node) {
          sectionRef.current = node
        }
      }}
      className="relative min-h-screen flex items-center py-24"
    >
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-white/70 uppercase tracking-widest mb-2">{subtitle}</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">{title}</h2>
        </motion.div>

        {children}
      </div>
    </section>
  )
})

ParallaxSection.displayName = "ParallaxSection"

export default ParallaxSection

