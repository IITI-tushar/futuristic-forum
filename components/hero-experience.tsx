"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  PerspectiveCamera,
  Environment,
  Float,
  Text3D,
  Sparkles,
  MeshDistortMaterial,
  GradientTexture,
  OrbitControls,
} from "@react-three/drei"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as THREE from "three"
import { useMobile } from "@/hooks/use-mobile"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

// Animated city grid that extends to infinity
const CyberGrid = () => {
  const gridRef = useRef()
  const { clock } = useThree()

  // Create a procedural grid material
  useEffect(() => {
    if (!gridRef.current) return

    const uniforms = {
      time: { value: 0 },
      color: { value: new THREE.Color("#00ffff") },
      scale: { value: 10.0 },
      intensity: { value: 1.5 },
    }

    const vertexShader = `
      varying vec2 vUv;
      varying float vElevation;
      uniform float time;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Add some movement to the grid
        pos.y += sin(pos.x * 0.5 + time) * 0.2;
        
        vElevation = pos.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `

    const fragmentShader = `
      varying vec2 vUv;
      varying float vElevation;
      uniform vec3 color;
      uniform float time;
      uniform float scale;
      uniform float intensity;
      
      float grid(vec2 uv, float res) {
        vec2 grid = fract(uv * res);
        return (step(0.98, grid.x) + step(0.98, grid.y)) * intensity;
      }
      
      void main() {
        // Create grid lines that fade with distance
        float dist = 1.0 - clamp(length(vUv - 0.5) * 1.5, 0.0, 1.0);
        float mainGrid = grid(vUv, scale);
        
        // Add a pulse effect
        float pulse = sin(time * 0.5) * 0.5 + 0.5;
        
        // Combine effects
        vec3 finalColor = color * (mainGrid * dist + 0.1) * (pulse * 0.3 + 0.7);
        
        gl_FragColor = vec4(finalColor, dist * 0.8);
      }
    `

    gridRef.current.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [])

  // Animate the grid
  useFrame(() => {
    if (gridRef.current?.material?.uniforms?.time) {
      gridRef.current.material.uniforms.time.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshBasicMaterial color="#00ffff" wireframe />
    </mesh>
  )
}

// Floating cyber spheres with distortion
const CyberSphere = ({ position, color, speed, size }) => {
  const sphereRef = useRef()
  const { clock } = useThree()

  useFrame(() => {
    if (sphereRef.current) {
      // Add subtle movement
      sphereRef.current.position.y += Math.sin(clock.getElapsedTime() * speed) * 0.002
      sphereRef.current.rotation.y += 0.002
      sphereRef.current.rotation.z += 0.001
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={sphereRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          distort={0.3}
          speed={4}
          transparent
          opacity={0.7}
        >
          <GradientTexture stops={[0, 0.5, 1]} colors={["#000000", color, "#ffffff"]} size={100} />
        </MeshDistortMaterial>
      </mesh>
    </Float>
  )
}

// Animated 3D text with glow
const GlowingText = ({ text, position, rotation, color, size = 1, glowIntensity = 1 }) => {
  const textRef = useRef()
  const { clock } = useThree()

  useFrame(() => {
    if (textRef.current) {
      // Subtle floating animation
      textRef.current.position.y += Math.sin(clock.getElapsedTime() * 0.5) * 0.001

      // Pulse the glow intensity
      if (textRef.current.material) {
        const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.2 + 0.8
        textRef.current.material.emissiveIntensity = glowIntensity * pulse
      }
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <Text3D
        ref={textRef}
        font="/fonts/Geist_Bold.json"
        position={position}
        rotation={rotation}
        size={size}
        height={0.1}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity}
          toneMapped={false}
          metalness={0.5}
          roughness={0.2}
        />
      </Text3D>
    </Float>
  )
}

// Particle system for ambient effects
const AmbientParticles = () => {
  return <Sparkles count={200} scale={20} size={2} speed={0.3} color={"#ffffff"} opacity={0.5} />
}

// Main 3D scene
const Scene = () => {
  const isMobile = useMobile()

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

      <CyberGrid />

      <CyberSphere position={[3, 0, -2]} color="#ff00ff" speed={1.5} size={1.2} />
      <CyberSphere position={[-3, -1, -3]} color="#00ffff" speed={1.2} size={1.5} />
      <CyberSphere position={[0, 2, -5]} color="#ff5500" speed={1.0} size={1.0} />

      <GlowingText
        text="CYBER"
        position={[-4, 1, 0]}
        rotation={[0, 0.2, 0]}
        color="#ff00ff"
        size={isMobile ? 0.8 : 1.5}
        glowIntensity={2}
      />

      <GlowingText
        text="NEXUS"
        position={[0.5, -1, 0]}
        rotation={[0, -0.2, 0]}
        color="#00ffff"
        size={isMobile ? 0.8 : 1.5}
        glowIntensity={2}
      />

      <AmbientParticles />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} blendFunction={BlendFunction.SCREEN} />
        <ChromaticAberration offset={[0.002, 0.002]} blendFunction={BlendFunction.NORMAL} opacity={0.3} />
      </EffectComposer>

      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

// Main component with parallax effects
export default function HeroExperience() {
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const yPosition = useTransform(scrollYProgress, [0, 1], [0, 200])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setIsClient(true)
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale, y: yPosition }}
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 z-10">
      {/* {isClient && (
        <div className="absolute inset-0 z-10">
          <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
            <Scene />
          </Canvas>
        </div>
      )} */}
      </div>

      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4",
          "bg-gradient-to-b from-transparent via-background/30 to-background",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="cyber-panel p-8 rounded-xl max-w-3xl"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 cyber-glitch"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              CYBER NEXUS
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Step into the future of online discussions where every interaction feels alive
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Button size="lg" className="cyber-button-primary text-lg">
              Enter The Grid
            </Button>
            <Button size="lg" variant="outline" className="cyber-button-secondary text-lg">
              Explore Realms
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

