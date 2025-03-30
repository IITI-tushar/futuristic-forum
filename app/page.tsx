"use client"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import LoadingExperience from "@/components/loading-experience"
import CategoryShowcase from "@/components/category-showcase"

// Dynamically import heavy components to improve initial load time
const HeroExperience = dynamic(() => import("@/components/hero-experience"), {
  loading: () => <LoadingExperience />,
  ssr: false,
})

const TrendingDiscussions = dynamic(() => import("@/components/trending-discussions"), {
  loading: () => <LoadingExperience />,
})

const LiveActivityFeed = dynamic(() => import("@/components/live-activity-feed"), {
  loading: () => <LoadingExperience />,
})

const AiAssistant = dynamic(() => import("@/components/ai-assistant"), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section with 3D Experience */}
      <section className="relative h-screen">
        <Suspense fallback={<LoadingExperience />}>
          <HeroExperience />
        </Suspense>
      </section>

      {/* Category Showcase */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="glitch-text text-4xl md:text-5xl font-bold mb-12 text-center">Enter Different Realms</h2>
          <CategoryShowcase />
        </div>
      </section>

      {/* Trending Discussions */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-background via-background/90 to-background">
        <div className="container mx-auto px-4">
          <h2 className="cyber-text text-4xl md:text-5xl font-bold mb-12 text-center">Live Discussions</h2>
          <Suspense fallback={<LoadingExperience />}>
            <TrendingDiscussions />
          </Suspense>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="neon-text text-4xl md:text-5xl font-bold mb-12 text-center">Real-Time Activity</h2>
          <Suspense fallback={<LoadingExperience />}>
            <LiveActivityFeed />
          </Suspense>
        </div>
      </section>

      {/* AI Assistant */}
      <AiAssistant />
    </main>
  )
}

