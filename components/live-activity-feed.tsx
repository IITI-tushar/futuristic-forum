"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { MessageSquare, Heart, Award, UserPlus, FileText, Zap } from "lucide-react"

// Activity types and their corresponding icons
const activityTypes = {
  post: { icon: FileText, color: "bg-blue-500" },
  reply: { icon: MessageSquare, color: "bg-green-500" },
  like: { icon: Heart, color: "bg-pink-500" },
  award: { icon: Award, color: "bg-yellow-500" },
  join: { icon: UserPlus, color: "bg-purple-500" },
}

// Sample activity data
const initialActivities = [
  {
    id: 1,
    type: "post",
    user: {
      name: "CyberPioneer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "started a new discussion about quantum computing",
    target: "Quantum Computing Breakthroughs",
    timeAgo: "2m",
  },
  {
    id: 2,
    type: "reply",
    user: {
      name: "NeonRider",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "replied to a discussion",
    target: "The Future of Neural Interfaces",
    timeAgo: "5m",
  },
  {
    id: 3,
    type: "like",
    user: {
      name: "DigitalNomad",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "liked a discussion",
    target: "Holographic UI Design Principles",
    timeAgo: "12m",
  },
  {
    id: 4,
    type: "award",
    user: {
      name: "TechVisionary",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "received a Visionary award in",
    target: "Future of Spatial Computing",
    timeAgo: "30m",
  },
  {
    id: 5,
    type: "join",
    user: {
      name: "SynthWave",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "joined the community",
    target: "",
    timeAgo: "1h",
  },
]

// New activity generator
const generateRandomActivity = (lastId) => {
  const users = [
    { name: "DataDrifter", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "NeonShadow", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "QuantumQuasar", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "CyberSurfer", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "VirtualVoyager", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const discussions = [
    "The Ethics of AI in Healthcare",
    "Next-Gen Gaming Engines",
    "Cybersecurity in the Quantum Era",
    "Holographic Interfaces for Smart Cities",
    "Neural Networks and Creative Design",
  ]

  const types = Object.keys(activityTypes)
  const randomType = types[Math.floor(Math.random() * types.length)]
  const randomUser = users[Math.floor(Math.random() * users.length)]
  const randomDiscussion = discussions[Math.floor(Math.random() * discussions.length)]

  let content = ""
  let target = ""

  switch (randomType) {
    case "post":
      content = "started a new discussion about future tech"
      target = randomDiscussion
      break
    case "reply":
      content = "replied to a discussion"
      target = randomDiscussion
      break
    case "like":
      content = "liked a discussion"
      target = randomDiscussion
      break
    case "award":
      content = "received a Visionary award in"
      target = randomDiscussion
      break
    case "join":
      content = "joined the community"
      target = ""
      break
  }

  return {
    id: lastId + 1,
    type: randomType,
    user: randomUser,
    content,
    target,
    timeAgo: "just now",
    isNew: true,
  }
}

// Activity item component with animations
const ActivityItem = ({ activity, onExit }) => {
  const Icon = activityTypes[activity.type].icon
  const color = activityTypes[activity.type].color

  useEffect(() => {
    if (activity.isNew) {
      const timer = setTimeout(() => {
        activity.isNew = false
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [activity])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={cn(
        "relative p-4 rounded-xl mb-3 transition-all duration-300",
        "border border-primary/10 bg-background/80 backdrop-blur-sm",
        activity.isNew ? "cyber-glow" : "",
      )}
    >
      {activity.isNew && (
        <motion.div
          className="absolute -right-1 -top-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Zap className="h-4 w-4 text-yellow-400" />
        </motion.div>
      )}

      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-full", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{activity.user.name}</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {activity.content}
            {activity.target && <span className="font-medium text-foreground"> {activity.target}</span>}
          </p>

          <p className="text-xs text-muted-foreground mt-1">{activity.timeAgo}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState(initialActivities)
  const containerRef = useRef(null)

  // Simulate new activities coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const lastId = activities[0]?.id || 0
      const newActivity = generateRandomActivity(lastId)

      setActivities((prev) => {
        const updated = [newActivity, ...prev]
        // Keep only the latest 8 activities
        return updated.slice(0, 8)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [activities])

  return (
    <div ref={containerRef} className="cyber-panel p-6 rounded-xl max-h-[600px] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Live Activity
        </h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-1 overflow-y-auto max-h-[500px] pr-2 cyber-scrollbar">
        <AnimatePresence initial={false}>
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onExit={() => {
                setActivities((prev) => prev.filter((a) => a.id !== activity.id))
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

