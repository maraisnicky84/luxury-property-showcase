"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { ChevronDown, Calendar, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import PropertyFeature from "@/components/property-feature"
import PropertyGallery from "@/components/property-gallery"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import ThreeDViewer from "@/components/three-d-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePropertyStatus } from "@/hooks/use-property-status"

export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { propertyStatus } = usePropertyStatus()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      sectionsRef.current.forEach((section, index) => {
        if (!section) return

        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
  }

  const sections = ["hero", "exterior", "interior", "amenities", "location"]

  return (
    <div ref={containerRef} className="relative">
      <Header />

      {/* Dot Navigation */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index ? "bg-primary scale-125" : "bg-primary/50 dark:bg-white/50"
              }`}
              aria-label={`Scroll to ${section} section`}
            />
          ))}
        </div>
      </div>

      {/* Hero Section with Video Background */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="https://res.cloudinary.com/darg6tbnp/video/upload/f_auto:video,q_auto/kosiwquujz3uvmbvs3n4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">Luxury Living Experience</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Book your stay in this exclusive property for an unforgettable getaway
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 relative"
              onClick={() => router.push("/book")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Stay
              {propertyStatus.type !== "available" && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="w-10 h-10 text-white" />
        </motion.div>
      </section>

      {/* Exterior Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="relative min-h-screen flex items-center py-24 bg-background"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-primary/70 uppercase tracking-widest mb-2">Exterior Design</div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Modern Retreat</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-foreground/90 leading-relaxed">
                Nestled in a serene environment, this architectural masterpiece offers a perfect blend of nature and
                luxury. The exterior features a harmonious blend of natural wood, glass, and sustainable materials that
                create a warm yet modern aesthetic.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <PropertyFeature icon="home" label="5,200 sq ft" />
                <PropertyFeature icon="tree" label="1.5 acre lot" />
                <PropertyFeature icon="car" label="3-car garage" />
                <PropertyFeature icon="users" label="Sleeps 8" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/exterior.png"
                alt="Exterior view"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interior Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="relative min-h-screen flex items-center py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-primary/70 uppercase tracking-widest mb-2">Interior Spaces</div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Refined Elegance</h2>
          </motion.div>

          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12 text-center max-w-3xl mx-auto"
            >
              <p className="text-lg text-foreground/90 leading-relaxed">
                Step inside to discover meticulously designed living spaces that blend luxury with comfort. Each room
                has been thoughtfully crafted to create an atmosphere of sophisticated tranquility for your perfect
                getaway.
              </p>
            </motion.div>

            <PropertyGallery />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-foreground mb-3">Master Suite</h3>
                <p className="text-muted-foreground">
                  Expansive master retreat with private terrace, walk-in closet, and spa-inspired bathroom.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-foreground mb-3">Gourmet Kitchen</h3>
                <p className="text-muted-foreground">
                  Chef's kitchen with custom cabinetry, premium appliances, and large center island.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-foreground mb-3">Entertainment Areas</h3>
                <p className="text-muted-foreground">
                  Multiple entertainment spaces including home theater, wine cellar, and game room.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="relative min-h-screen flex items-center py-24 bg-background"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-primary/70 uppercase tracking-widest mb-2">Lifestyle Features</div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Exclusive Amenities</h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {[
                  {
                    title: "Infinity Edge Pool",
                    description:
                      "Seamlessly blending with the horizon, the infinity pool offers a tranquil retreat with panoramic views.",
                    image: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=800&h=500&auto=format&fit=crop"
                  },
                  {
                    title: "Wellness Center",
                    description:
                      "Complete with state-of-the-art fitness equipment, yoga studio, sauna, and massage room.",
                    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&h=500&auto=format&fit=crop"
                  },
                  {
                    title: "Smart Home Technology",
                    description:
                      "Comprehensive automation system controlling lighting, climate, security, and entertainment.",
                    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&h=500&auto=format&fit=crop"
                  },
                  {
                    title: "Outdoor Living",
                    description:
                      "Multiple terraces, outdoor kitchen, fire pit, and landscaped gardens for entertaining.",
                    image: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=800&h=500&auto=format&fit=crop"
                  },
                ].map((amenity, index) => (
                  <motion.div
                    key={amenity.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card p-6 rounded-lg shadow-md"
                  >
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={amenity.image}
                        alt={amenity.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{amenity.title}</h3>
                    <p className="text-muted-foreground">{amenity.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&h=1200&auto=format&fit=crop"
                alt="Luxury Property Overview"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section with 3D View */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="relative min-h-screen flex items-center py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-primary/70 uppercase tracking-widest mb-2">Neighborhood</div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Prime Location</h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-card p-8 rounded-lg shadow-lg"
            >
              <Tabs defaultValue="map" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="map">Location Map</TabsTrigger>
                  <TabsTrigger value="3d">3D Street View</TabsTrigger>
                </TabsList>
                <TabsContent value="map" className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=1000&h=600&auto=format&fit=crop"
                    alt="Luxury Property Interior"
                    width={1000}
                    height={600}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    priority
                  />
                </TabsContent>
                <TabsContent value="3d" className="aspect-video relative rounded-lg overflow-hidden">
                  <ThreeDViewer />
                </TabsContent>
              </Tabs>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-card p-6 rounded-lg shadow-lg h-full">
                <h3 className="text-xl font-semibold text-foreground mb-4">Exclusive Neighborhood</h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/20 p-1 rounded-full mt-1"></span>
                    <span>10 minutes to downtown</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/20 p-1 rounded-full mt-1"></span>
                    <span>5 minutes to private beaches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/20 p-1 rounded-full mt-1"></span>
                    <span>Proximity to exclusive golf clubs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/20 p-1 rounded-full mt-1"></span>
                    <span>Top-rated restaurants nearby</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/20 p-1 rounded-full mt-1"></span>
                    <span>Gated community with 24/7 security</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary/20 p-1 rounded-full mt-1"></span>
                    <span>15 minutes to international airport</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Experience Luxury Living?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book your stay now and indulge in the ultimate luxury experience.
            </p>
            <Button size="lg" onClick={() => router.push("/book")} className="group relative">
              Book Your Stay
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              {propertyStatus.type !== "available" && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
