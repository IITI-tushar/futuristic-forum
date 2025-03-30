"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"

export default function LoadingExperience() {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-60">
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="cyber-loading">
          <Zap className="h-8 w-8 text-primary" />
        </div>

        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div
            className={cn("w-full h-full rounded-full", "bg-gradient-to-r from-cyan-500/20 to-blue-500/20", "blur-md")}
          />
        </motion.div>
      </motion.div>

      <motion.p
        className="mt-6 text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Initializing cyber experience...
      </motion.p>

      <div className="mt-4 flex gap-2">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="h-2 w-2 rounded-full bg-primary"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}

