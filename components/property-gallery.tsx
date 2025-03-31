"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

// Update the PropertyGallery component to use light background colors
export default function PropertyGallery() {
  const [selectedImage, setSelectedImage] = useState(0)

  const defaultImages = [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&h=600&auto=format&fit=crop",
      alt: "Luxury Property View",
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=800&h=600&auto=format&fit=crop",
      alt: "Interior View",
    },
  ]

  const images = [
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&h=600&auto=format&fit=crop",
      alt: "Modern luxury living room",
      title: "Living Room",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&h=600&auto=format&fit=crop",
      alt: "Elegant master bedroom",
      title: "Master Suite",
    },
    {
      src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&h=600&auto=format&fit=crop",
      alt: "Luxury bathroom",
      title: "Master Bathroom",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&h=600&auto=format&fit=crop",
      alt: "Gourmet kitchen",
      title: "Kitchen",
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
          src={images[selectedImage].src || "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=800&h=600&auto=format&fit=crop"}
          alt={images[selectedImage].alt || "Property Image"}
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
              src={image.src || "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=800&h=600&auto=format&fit=crop"}
              alt={image.alt || "Property Image"}
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
