"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MessageSquare, Heart, Eye, Clock, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const threads = [
  {
    id: 1,
    title: "The future of AI in everyday applications",
    preview: "Discussing how AI is becoming more integrated into our daily lives and what that means for society.",
    author: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Technology",
    replies: 42,
    views: 1204,
    likes: 89,
    timeAgo: "2h",
    hot: true,
  },
  {
    id: 2,
    title: "Cyberpunk aesthetics in modern web design",
    preview: "Exploring the growing trend of cyberpunk-inspired UI/UX and its impact on user engagement.",
    author: {
      name: "Maya Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Design",
    replies: 28,
    views: 876,
    likes: 67,
    timeAgo: "5h",
  },
  {
    id: 3,
    title: "The metaverse: hype or the next big thing?",
    preview: "Critical analysis of the metaverse concept and its potential to transform online interactions.",
    author: {
      name: "Raj Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Virtual Reality",
    replies: 56,
    views: 1532,
    likes: 124,
    timeAgo: "1d",
    hot: true,
  },
  {
    id: 4,
    title: "Quantum computing explained for beginners",
    preview: "A simplified guide to understanding quantum computing principles and their real-world applications.",
    author: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Science",
    replies: 19,
    views: 743,
    likes: 45,
    timeAgo: "2d",
  },
  {
    id: 5,
    title: "The ethics of generative AI art",
    preview: "Debating the copyright implications and artistic merit of AI-generated artwork in the creative industry.",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Art & AI",
    replies: 37,
    views: 912,
    likes: 76,
    timeAgo: "3d",
  },
]

export default function ForumThreads() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  return (
    <section ref={containerRef} className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">Latest Discussions</h2>
        <p className="text-muted-foreground">Join the conversation on trending topics</p>
      </motion.div>

      <div className="grid gap-6">
        {threads.map((thread, index) => (
          <ThreadCard key={thread.id} thread={thread} index={index} />
        ))}
      </div>
    </section>
  )
}

function ThreadCard({ thread, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: false, amount: 0.2 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer",
          "border border-primary/10 hover:border-primary/30",
          "bg-gradient-to-r from-background to-background/80",
          thread.hot ? "shadow-[0_0_15px_rgba(255,0,255,0.15)]" : "",
        )}
      >
        {thread.hot && (
          <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold py-1 w-28 text-center">
              HOT
            </div>
          </div>
        )}

        <motion.div
          className="p-6"
          style={{
            background: isHovered
              ? "radial-gradient(circle at var(--x) var(--y), rgba(255,0,255,0.1) 0%, transparent 100%)"
              : "none",
          }}
          onMouseMove={(e) => {
            if (cardRef.current) {
              const rect = cardRef.current.getBoundingClientRect()
              const x = ((e.clientX - rect.left) / rect.width) * 100
              const y = ((e.clientY - rect.top) / rect.height) * 100
              cardRef.current.style.setProperty("--x", `${x}%`)
              cardRef.current.style.setProperty("--y", `${y}%`)
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={thread.author.avatar} alt={thread.author.name} />
                <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{thread.author.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> {thread.timeAgo}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
              {thread.category}
            </Badge>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{thread.title}</h3>
            <p className="text-muted-foreground">{thread.preview}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-sm">{thread.replies}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-sm">{thread.views}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-sm">{thread.likes}</span>
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
        </motion.div>
      </Card>
    </motion.div>
  )
}

