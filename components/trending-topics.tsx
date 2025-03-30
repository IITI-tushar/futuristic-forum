"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const topics = [
  { id: 1, name: "Artificial Intelligence", count: 1243 },
  { id: 2, name: "Web Development", count: 986 },
  { id: 3, name: "Cybersecurity", count: 754 },
  { id: 4, name: "Virtual Reality", count: 621 },
  { id: 5, name: "Blockchain", count: 589 },
  { id: 6, name: "UX Design", count: 432 },
  { id: 7, name: "Machine Learning", count: 387 },
  { id: 8, name: "Cloud Computing", count: 356 },
  { id: 9, name: "IoT", count: 298 },
  { id: 10, name: "Data Science", count: 276 },
]

export default function TrendingTopics() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  return (
    <section ref={containerRef} className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold mb-2">Trending Topics</h2>
        <p className="text-muted-foreground">Explore what's hot in the community right now</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        {topics.map((topic, index) => (
          <TopicBadge key={topic.id} topic={topic} index={index} />
        ))}
      </motion.div>
    </section>
  )
}

function TopicBadge({ topic, index }) {
  const getGradient = (index) => {
    const gradients = [
      "from-pink-600 to-purple-600",
      "from-cyan-600 to-blue-600",
      "from-orange-600 to-red-600",
      "from-green-600 to-teal-600",
      "from-indigo-600 to-violet-600",
    ]
    return gradients[index % gradients.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <Badge
        className={cn(
          "px-3 py-1 text-sm cursor-pointer",
          "bg-gradient-to-r",
          getGradient(index),
          "hover:shadow-lg transition-all duration-300",
          "hover:shadow-primary/20",
        )}
      >
        {topic.name}
        <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{topic.count}</span>
      </Badge>
    </motion.div>
  )
}

