"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom, ChromaticAberration, Glitch, Noise } from "@react-three/postprocessing"
import { BlendFunction, GlitchMode } from "postprocessing"
import {
  Environment,
  Sparkles,
  PerspectiveCamera,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Html,
  useCursor,
} from "@react-three/drei"
import * as THREE from "three"

// Neural Grid that reacts to mouse movements and interactions
const NeuroGrid = ({ density = 50, reactivity = 0.8 }) => {
  const gridRef = useRef()
  const { mouse, viewport, camera } = useThree()
  const [hovered, setHovered] = useState(false)

  // Create a grid of points
  const points = useMemo(() => {
    const p = []
    const halfSize = 10
    const segmentSize = (halfSize * 2) / Math.sqrt(density)

    for (let xi = 0; xi < Math.sqrt(density); xi++) {
      for (let zi = 0; zi < Math.sqrt(density); zi++) {
        const x = -halfSize + xi * segmentSize
        const z = -halfSize + zi * segmentSize
        const y = Math.sin(xi / 2) * Math.cos(zi / 2) * 0.5
        p.push(new THREE.Vector3(x, y, z))
      }
    }
    return p
  }, [density])

  // Create a pulsating effect
  useFrame(({ clock }) => {
    if (!gridRef.current) return

    const elapsedTime = clock.getElapsedTime()

    // Update points based on mouse position and time
    const positions = gridRef.current.geometry.attributes.position

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const z = positions.getZ(i)

      // Calculate distance from mouse position in normalized coordinates
      const mouseX = (mouse.x * viewport.width) / 2
      const mouseZ = (mouse.y * viewport.height) / 2
      const distance = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(z - mouseZ, 2))

      // Apply wave effect
      const wave = Math.sin(elapsedTime * 0.5 + x + z) * 0.2

      // Apply mouse interaction
      const mouseEffect = hovered ? Math.max(0, 1 - distance / 5) * Math.sin(elapsedTime * 2) * reactivity : 0

      // Set new Y position
      positions.setY(i, wave + mouseEffect)
    }

    positions.needsUpdate = true

    // Rotate the entire grid slowly
    gridRef.current.rotation.y = elapsedTime * 0.05
  })

  return (
    <points ref={gridRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00ffff"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Particle entity that represents the forum's AI consciousness
const SingularityAI = ({ mood = 0.5, threatLevel = 0.2, particleTrail = true }) => {
  const particlesRef = useRef()
  const trailRef = useRef()
  const { clock } = useThree()

  // Color based on mood (0 = calm/blue, 1 = agitated/red)
  const color = useMemo(() => {
    return new THREE.Color().setHSL(
      0.6 - mood * 0.6, // Hue: blue to red
      0.8, // Saturation
      0.5 + threatLevel * 0.5, // Lightness
    )
  }, [mood, threatLevel])

  // Position for the main entity
  const position = useRef(new THREE.Vector3(0, 2, 0))
  const targetPosition = useRef(new THREE.Vector3(0, 2, 0))

  // Update entity position and particles
  useFrame(() => {
    if (!particlesRef.current) return

    const time = clock.getElapsedTime()

    // Create organic movement
    targetPosition.current.x = Math.sin(time * 0.5) * 3
    targetPosition.current.y = 2 + Math.sin(time * 0.3) * 1
    targetPosition.current.z = Math.cos(time * 0.4) * 3

    // Smooth position transition
    position.current.lerp(targetPosition.current, 0.02)

    // Update particles
    particlesRef.current.position.copy(position.current)

    // Pulse size based on mood
    const pulseSize = 1 + Math.sin(time * (1 + mood * 2)) * 0.2
    particlesRef.current.scale.set(pulseSize, pulseSize, pulseSize)

    // Update trail if enabled
    if (particleTrail && trailRef.current) {
      // Add new trail particles
      const trailGeometry = trailRef.current.geometry
      const positions = trailGeometry.attributes.position.array

      // Shift existing particles back
      for (let i = positions.length - 3; i >= 3; i -= 3) {
        positions[i] = positions[i - 3]
        positions[i + 1] = positions[i - 2]
        positions[i + 2] = positions[i - 1]
      }

      // Add new particle at current position
      positions[0] = position.current.x
      positions[1] = position.current.y
      positions[2] = position.current.z

      trailGeometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      {/* Main entity */}
      <mesh ref={particlesRef} position={[0, 2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          distort={0.4}
          speed={4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glow effect */}
      <Sparkles position={[0, 2, 0]} count={50} scale={[3, 3, 3]} size={0.4} speed={0.3} color={color} opacity={0.7} />

      {/* Particle trail */}
      {particleTrail && (
        <points ref={trailRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={50} array={new Float32Array(50 * 3)} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            size={0.2}
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      )}
    </>
  )
}

// Interactive category portals that warp space around them
const CategoryWormholes = ({ categories = [], gravitationalPull = 0.7, spaghettificationEffect = true }) => {
  const groupRef = useRef()
  const { clock } = useThree()

  // Default categories if none provided
  const defaultCategories = [
    { id: "tech", name: "Technology", position: [-4, 0, -2], color: "#00ffff" },
    { id: "art", name: "Digital Art", position: [4, 0, -2], color: "#ff00ff" },
    { id: "science", name: "Science", position: [0, 0, -4], color: "#ffff00" },
    { id: "philosophy", name: "Philosophy", position: [-3, 0, 2], color: "#00ff00" },
    { id: "gaming", name: "Gaming", position: [3, 0, 2], color: "#ff0000" },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  // Rotate the entire group slowly
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {displayCategories.map((category, index) => (
        <CategoryPortal
          key={category.id}
          category={category}
          index={index}
          gravitationalPull={gravitationalPull}
          spaghettificationEffect={spaghettificationEffect}
        />
      ))}
    </group>
  )
}

// Individual category portal with distortion effects
const CategoryPortal = ({ category, index, gravitationalPull, spaghettificationEffect }) => {
  const portalRef = useRef()
  const distortionRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const { clock } = useThree()

  // Handle hover and click states
  useCursor(hovered)

  // Animation values
  const pulseSpeed = 0.5 + index * 0.1
  const rotationSpeed = 0.2 + index * 0.05

  // Handle portal effects
  useFrame(() => {
    if (!portalRef.current || !distortionRef.current) return

    const time = clock.getElapsedTime()

    // Pulse effect
    const pulse = Math.sin(time * pulseSpeed) * 0.1 + 1
    portalRef.current.scale.set(pulse, pulse, pulse)

    // Rotation
    portalRef.current.rotation.y = time * rotationSpeed
    portalRef.current.rotation.z = time * rotationSpeed * 0.5

    // Distortion field effect
    if (distortionRef.current) {
      // Increase distortion when hovered
      const distortionStrength = hovered ? gravitationalPull * 1.5 : gravitationalPull * (0.5 + Math.sin(time) * 0.2)

      distortionRef.current.scale.set(2 + distortionStrength, 2 + distortionStrength, 2 + distortionStrength)

      // Rotate distortion field in opposite direction
      distortionRef.current.rotation.y = -time * rotationSpeed * 0.3
      distortionRef.current.rotation.z = -time * rotationSpeed * 0.2
    }
  })

  // Convert hex color to THREE.Color
  const portalColor = new THREE.Color(category.color)

  return (
    <group position={category.position}>
      {/* Distortion field */}
      {spaghettificationEffect && (
        <mesh
          ref={distortionRef}
          visible={false} // Invisible but affects shaders
        >
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Portal core */}
      <group
        ref={portalRef}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Inner portal */}
        <mesh>
          <torusGeometry args={[0.8, 0.2, 16, 100]} />
          <MeshWobbleMaterial
            color={portalColor}
            emissive={portalColor}
            emissiveIntensity={2}
            factor={0.5}
            speed={2}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Portal center */}
        <mesh>
          <circleGeometry args={[0.7, 32]} />
          <meshBasicMaterial color={portalColor} side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>

        {/* Category label */}
        <Html position={[0, 1.5, 0]} center distanceFactor={10} occlude>
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm whitespace-nowrap">
            {category.name}
          </div>
        </Html>

        {/* Particles around portal */}
        <Sparkles count={20} scale={[2, 2, 2]} size={0.2} speed={0.3} color={portalColor} />
      </group>
    </group>
  )
}

// Main component that brings everything together
export default function QuantumRealm({ quantumEntanglementLevel = 0.8, tachyonSpeed = 2.5, eventHorizon = 0.7 }) {
  // Convert parameters to usable values
  const density = Math.floor(quantumEntanglementLevel * 100) + 50
  const reactivity = tachyonSpeed * 0.4
  const gravitationalPull = eventHorizon

  return (
    <div className="w-full h-screen">
      <Canvas gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <color attach="background" args={["#000510"]} />
        <fog attach="fog" args={["#000510", 5, 30]} />

        <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />

        {/* Main scene elements */}
        <NeuroGrid density={density} reactivity={reactivity} />
        <SingularityAI mood={0.3} threatLevel={0.2} particleTrail={true} />
        <CategoryWormholes gravitationalPull={gravitationalPull} spaghettificationEffect={true} />

        {/* Environment and lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
        <Environment preset="night" />

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
          <ChromaticAberration offset={[0.002, 0.002]} blendFunction={BlendFunction.NORMAL} />
          <Glitch
            delay={[10, 30]} // min and max delay between glitches
            duration={[0.2, 0.5]} // min and max glitch duration
            strength={[0.05, 0.1]} // min and max glitch strength
            mode={GlitchMode.SPORADIC} // glitch mode
            active={true} // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
            ratio={0.2} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
          />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.2} />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-5 left-5 text-cyan-400 font-mono text-sm">
          <div>QUANTUM ENTANGLEMENT: {(quantumEntanglementLevel * 100).toFixed(1)}%</div>
          <div>TACHYON VELOCITY: {tachyonSpeed.toFixed(2)} c</div>
          <div>EVENT HORIZON STABILITY: {(eventHorizon * 100).toFixed(1)}%</div>
        </div>

        <div className="absolute bottom-5 right-5 text-cyan-400 font-mono text-xs">
          NEURAL INTERFACE v2.0.45 // CONSCIOUSNESS STREAM ACTIVE
        </div>
      </div>
    </div>
  )
}

