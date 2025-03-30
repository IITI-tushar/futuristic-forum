"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Heart, Eye, Clock, ArrowUpRight, Sparkles, Flame, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample discussion data
const discussions = [
  {
    id: 1,
    title: "The future of neural interfaces in everyday computing",
    preview:
      "Discussing how brain-computer interfaces will revolutionize how we interact with technology in the next decade.",
    author: {
      name: "NeuraTech",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Tech & AI",
    categoryColor: "from-cyan-500 to-blue-600",
    replies: 42,
    views: 1204,
    likes: 89,
    timeAgo: "2h",
    trending: true,
    hot: true,
  },
  {
    id: 2,
    title: "Procedural generation techniques in modern game design",
    preview: "Exploring advanced algorithms for creating infinite, unique game worlds and experiences.",
    author: {
      name: "GameArchitect",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Gaming",
    categoryColor: "from-red-500 to-orange-600",
    replies: 28,
    views: 876,
    likes: 67,
    timeAgo: "5h",
    trending: true,
  },
  {
    id: 3,
    title: "Holographic UI design principles for spatial computing",
    preview:
      "Design guidelines for creating intuitive interfaces in AR/VR environments and spatial computing platforms.",
    author: {
      name: "HoloDesigner",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Design & Art",
    categoryColor: "from-purple-500 to-pink-600",
    replies: 56,
    views: 1532,
    likes: 124,
    timeAgo: "1d",
    hot: true,
  },
  {
    id: 4,
    title: "Quantum computing explained: From qubits to quantum supremacy",
    preview: "A comprehensive breakdown of quantum computing principles and their real-world applications.",
    author: {
      name: "QuantumLeap",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Science",
    categoryColor: "from-yellow-500 to-amber-600",
    replies: 19,
    views: 743,
    likes: 45,
    timeAgo: "2d",
  },
  {
    id: 5,
    title: "The ethics of generative AI art and creative ownership",
    preview: "Debating the copyright implications and artistic merit of AI-generated artwork in the creative industry.",
    author: {
      name: "ArtificialMuse",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Design & Art",
    categoryColor: "from-purple-500 to-pink-600",
    replies: 37,
    views: 912,
    likes: 76,
    timeAgo: "3d",
  },
]

// Discussion card with advanced animations
function DiscussionCard({ discussion, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1])

  // Track mouse position for magnetic hover effect
  useEffect(() => {
    if (!cardRef.current) return

    const handleMouseMove = (e) => {
      if (!isHovered) return

      const card = cardRef.current
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Calculate position relative to center
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Calculate distance from center (0-1)
      const distanceX = (x - centerX) / centerX
      const distanceY = (y - centerY) / centerY

      // Apply subtle transform based on mouse position
      card.style.transform = `perspective(1000px) rotateX(${distanceY * 5}deg) rotateY(${distanceX * -5}deg) translateZ(10px)`
    }

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
      }
    }

    const card = cardRef.current
    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isHovered])

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl transition-all duration-500",
          "border border-primary/10 hover:border-primary/30",
          "bg-background/80 backdrop-blur-sm p-6",
          "cyber-card",
        )}
      >
        {/* Animated background gradient */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            "bg-gradient-radial from-transparent to-transparent",
            isHovered ? "opacity-10" : "",
          )}
          style={{
            background: isHovered
              ? `radial-gradient(circle at var(--x, 50%) var(--y, 50%), ${discussion.hot ? "#ff0066" : "#00ffff"}, transparent 60%)`
              : "none",
          }}
          onMouseMove={(e) => {
            if (cardRef.current) {
              const rect = cardRef.current.getBoundingClientRect()
              const x = ((e.clientX - rect.left) / rect.width) * 100
              const y = ((e.clientY - rect.top) / rect.height) * 100
              e.currentTarget.style.setProperty("--x", `${x}%`)
              e.currentTarget.style.setProperty("--y", `${y}%`)
            }
          }}
        />

        {/* Status indicators */}
        <div className="absolute top-0 right-0 p-4 flex gap-2">
          {discussion.hot && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1"
            >
              <Flame className="h-3 w-3" />
              <span>HOT</span>
            </motion.div>
          )}

          {discussion.trending && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              <span>TRENDING</span>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="cyber-avatar border-2 border-primary/20">
                <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{discussion.author.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {discussion.timeAgo}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn("bg-gradient-to-r text-white", discussion.categoryColor)}>
              {discussion.category}
            </Badge>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 cyber-text">{discussion.title}</h3>
            <p className="text-muted-foreground">{discussion.preview}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-sm">{discussion.replies}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-sm">{discussion.views}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-sm">{discussion.likes}</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-primary/10 p-2 rounded-full"
            >
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </motion.div>
          </div>
        </div>

        {/* Animated particles on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: "50%",
                    y: "50%",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 1 + Math.random(),
                    delay: i * 0.1,
                  }}
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function TrendingDiscussions() {
  return (
    <div className="space-y-6">
      {discussions.map((discussion, index) => (
        <DiscussionCard key={discussion.id} discussion={discussion} index={index} />
      ))}
    </div>
  )
}

