"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

// Update the PropertyGallery component to use light background colors
export default function PropertyGallery() {
  const [selectedImage, setSelectedImage] = useState(0)

  const images = [
    {
      src: "/images/exterior.png",
      alt: "Modern exterior with natural surroundings",
      title: "Exterior",
    },
    {
      src: "/images/pool-view.png",
      alt: "Infinity pool with modern architecture",
      title: "Pool View",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Master bedroom suite",
      title: "Master Suite",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Spa-inspired bathroom",
      title: "Bathroom",
    },
  ]

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-xl"
      >
        <Image
          src={images[selectedImage].src || "/placeholder.svg"}
          alt={images[selectedImage].alt}
          width={1200}
          height={675}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-xl font-semibold text-white">{images[selectedImage].title}</h3>
          <p className="text-white/80">{images[selectedImage].alt}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-4 gap-2"
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative rounded-lg overflow-hidden aspect-square shadow-md ${
              selectedImage === index ? "ring-2 ring-primary" : "opacity-70"
            }`}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </motion.div>
    </div>
  )
}

