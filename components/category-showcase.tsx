"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Cpu, Gamepad2, Palette, Headphones, Brain, Coffee, LucideProps } from "lucide-react"

// Wrapper to ensure icons accept className
const IconWrapper = (Icon: React.ComponentType<LucideProps>) => (props: LucideProps) => <Icon {...props} className={props.className} />;

// Category data with unique themes
const categories = [
  {
    id: "tech-ai",
    icon: IconWrapper(Cpu),
    name: "Tech & AI",
    description: "Explore the cutting edge of technology and artificial intelligence",
    color: "from-cyan-500 to-blue-600",
    hoverColor: "group-hover:from-cyan-400 group-hover:to-blue-500",
    bgPattern: "tech-pattern",
    particleColor: "#00ffff",
  },
  {
    id: "gaming",
    icon: IconWrapper(Gamepad2),
    name: "Gaming",
    description: "Discuss the latest games, strategies, and gaming hardware",
    color: "from-red-500 to-orange-600",
    hoverColor: "group-hover:from-red-400 group-hover:to-orange-500",
    bgPattern: "gaming-pattern",
    particleColor: "#ff3e00",
  },
  {
    id: "design-art",
    icon: IconWrapper(Palette),
    name: "Design & Art",
    description: "Explore creativity and artistic designs",
    color: "from-purple-500 to-pink-600",
    hoverColor: "group-hover:from-purple-400 group-hover:to-pink-500",
    bgPattern: "design-pattern",
    particleColor: "#ff00ff",
  },
  {
    id: "music-audio",
    icon: IconWrapper(Headphones),
    name: "Music & Audio",
    description: "Talk about music production, instruments, and audio engineering",
    color: "from-green-500 to-teal-600",
    hoverColor: "group-hover:from-green-400 group-hover:to-teal-500",
    bgPattern: "music-pattern",
    particleColor: "#00ff7f",
  },
  {
    id: "science",
    icon: IconWrapper(Brain),
    name: "Science",
    description: "Discuss scientific discoveries, theories, and research",
    color: "from-indigo-500 to-violet-600",
    hoverColor: "group-hover:from-indigo-400 group-hover:to-violet-500",
    bgPattern: "science-pattern",
    particleColor: "#8a2be2",
  },
  {
    id: "casual-talks",
    icon: IconWrapper(Coffee),
    name: "Casual Talks",
    description: "Relaxed conversations about everyday life and interests",
    color: "from-rose-500 to-pink-600",
    hoverColor: "group-hover:from-rose-400 group-hover:to-pink-500",
    bgPattern: "casual-talks-pattern",
    particleColor: "#ff69b4",
  },
]

// Particle effect component
const ParticleEffect = ({ color }: { color: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
          initial={{
            x: "50%",
            y: "50%",
            opacity: 0,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

// Category card component with animations
const CategoryCard = ({
  category,
  isExpanded,
  onClick,
}: {
  category: typeof categories[0]
  isExpanded: boolean
  onClick: (id: string) => void
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // 3D tilt effect
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

      // Update glow position
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${category.particleColor}30 0%, transparent 70%)`
      }
    }

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    }

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [category.particleColor])

  return (
    <motion.div
      ref={cardRef}
      layout
      onClick={() => onClick(category.id)}
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer",
        "border border-primary/10 transition-all duration-500",
        "bg-background/80 backdrop-blur-sm",
        isExpanded ? "col-span-2 row-span-2" : "col-span-1 row-span-1",
        isExpanded ? "p-8" : "p-6",
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ layout: { duration: 0.6, type: "spring" } }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

      {/* Background pattern */}
      <div
        className={cn(
          "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500",
          category.bgPattern,
        )}
      />

      {/* Particle effect */}
      <ParticleEffect color={category.particleColor} />

      {/* Content */}
      <div className="relative z-10">
        <div
          className={cn(
            "w-12 h-12 rounded-full mb-4 flex items-center justify-center",
            "bg-gradient-to-br transition-all duration-300",
            category.color,
            category.hoverColor,
          )}
        >
          <category.icon className="w-6 h-6 text-white" />
        </div>

        <h3 className={cn("font-bold transition-all duration-300", isExpanded ? "text-3xl mb-4" : "text-xl mb-2")}>
          {category.name}
        </h3>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-muted-foreground mb-6">{category.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function CategoryShowcase() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const containerRef = useRef(null)

  const handleClick = (id: string | null) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <motion.div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, staggerChildren: 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isExpanded={expandedId === category.id}
          onClick={handleClick}
        />
      ))}
    </motion.div>
  )
}

