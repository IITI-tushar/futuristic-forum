"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, Text3D, PerspectiveCamera } from "@react-three/drei"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import * as THREE from "three"

const NeonText = ({ text, position, rotation, color, size = 1 }) => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        font="/fonts/Geist_Bold.json"
        position={position}
        rotation={rotation}
        size={size}
        height={0.1}
        curveSegments={12}
      >
        {text}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </Text3D>
    </Float>
  )
}

const CyberSphere = ({ position }) => {
  const meshRef = useRef()

  // Create a procedural grid texture
  useEffect(() => {
    if (!meshRef.current) return

    // Create a canvas for the procedural texture
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext("2d")

    // Fill background
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#00ffff"
    ctx.lineWidth = 1
    const gridSize = 32

    // Draw vertical lines
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)

    // Apply texture to the mesh material
    meshRef.current.material.map = texture
    meshRef.current.material.needsUpdate = true
  }, [])

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#000000" emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
    </Float>
  )
}

export default function HeroSection() {
  const containerRef = useRef(null)
  const isMobile = useMobile()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.div ref={containerRef} style={{ opacity, scale }} className="relative h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0 z-10">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

          <CyberSphere position={[2, 0, -2]} />
          <CyberSphere position={[-2.5, -1, -3]} />

          <NeonText
            text="NEXUS"
            position={[-2.5, 0.5, 0]}
            rotation={[0, 0.1, 0]}
            color="#ff00ff"
            size={isMobile ? 0.6 : 1}
          />
          <NeonText
            text="FORUM"
            position={[0.5, -0.8, 0]}
            rotation={[0, -0.1, 0]}
            color="#00ffff"
            size={isMobile ? 0.6 : 1}
          />

          <Environment preset="night" />
        </Canvas>
      </div>

      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4",
          "bg-gradient-to-b from-transparent via-background/30 to-background",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-sm bg-background/30 p-8 rounded-xl border border-primary/20 shadow-lg"
          style={{
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.1)",
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            Welcome to Nexus Forum
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Join the next generation of online discussions with our immersive, futuristic forum experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-500/20"
            >
              Join Now
            </Button>
            <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 shadow-lg">
              Explore Topics
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

