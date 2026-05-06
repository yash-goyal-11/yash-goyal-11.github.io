import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Holographic Skill Constellation
function HolographicConstellation() {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  const skills = [
    'Python', 'PyTorch', 'LangChain', 'AWS', 'Docker', 'Neo4j',
    'TensorFlow', 'FastAPI', 'Computer Vision', 'NVIDIA', 'Azure ML', 'LLMs'
  ]

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Create particle geometry for skills
  useEffect(() => {
    if (!groupRef.current) return

    const positions = new Float32Array(skills.length * 3)
    const colors = new Float32Array(skills.length * 3)
    
    for (let i = 0; i < skills.length; i++) {
      const angle = (i / skills.length) * Math.PI * 2
      const radius = 8
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.6
      positions[i * 3 + 2] = Math.sin(angle * 2) * 3

      // Color gradient from teal to emerald
      const hue = 0.4 + (i / skills.length) * 0.3
      colors[i * 3] = Math.cos(hue) * 0.5 + 0.5
      colors[i * 3 + 1] = Math.sin(hue) * 0.5 + 0.5
      colors[i * 3 + 2] = Math.sin(hue * 2) * 0.5 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    groupRef.current.add(points)
    particlesRef.current = points

    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [])

  // Animate rotation with mouse interaction
  useFrame((state) => {
    if (groupRef.current) {
      // Mouse-controlled rotation
      groupRef.current.rotation.x = mouseRef.current.y * 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      groupRef.current.rotation.y = mouseRef.current.x * 0.5 + state.clock.elapsedTime * 0.2
      groupRef.current.rotation.z += 0.0003
    }

    // Animated camera orbit with mouse influence
    camera.position.x = (Math.sin(state.clock.elapsedTime * 0.1) * 15) + (mouseRef.current.x * 5)
    camera.position.z = (Math.cos(state.clock.elapsedTime * 0.1) * 15) + (mouseRef.current.y * 5)
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} color="#3cd0bd" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3cd0bd" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00b894" />
    </group>
  )
}

// Skill connection lines
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null)
  
  useFrame(() => {
    if (linesRef.current) {
      linesRef.current.rotation.z += 0.0001
    }
  })

  const skills = [
    'Python', 'PyTorch', 'LangChain', 'AWS', 'Docker', 'Neo4j',
    'TensorFlow', 'FastAPI', 'Computer Vision', 'NVIDIA', 'Azure ML', 'LLMs'
  ]

  const points = skills.map((_, i) => {
    const angle = (i / skills.length) * Math.PI * 2
    const radius = 8
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.6,
      Math.sin(angle * 2) * 3
    )
  })

  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []

  // Connect adjacent skills
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length
    positions.push(points[i].x, points[i].y, points[i].z)
    positions.push(points[next].x, points[next].y, points[next].z)
    
    // Connect to center
    if (i % 2 === 0) {
      positions.push(points[i].x, points[i].y, points[i].z)
      positions.push(0, 0, 0)
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial
        color="#3cd0bd"
        transparent
        opacity={0.2}
        linewidth={1}
      />
    </lineSegments>
  )
}

export default function SkillConstellation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => setIsVisible(true),
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const skills = [
    'Python', 'PyTorch', 'LangChain', 'AWS', 'Docker', 'Neo4j',
    'TensorFlow', 'FastAPI', 'Computer Vision', 'NVIDIA', 'Azure ML', 'LLMs'
  ]

  return (
    <section
      id="constellation"
      ref={sectionRef}
      className="relative z-10 py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-display mb-4 text-center text-4xl font-bold text-white md:text-5xl">
          Skill <span className="text-[#3cd0bd]">Constellation</span>
        </h2>
        <p className="mb-8 text-center text-[#64748b]">
          My expertise visualized as an interactive holographic system
        </p>

        {/* 3D Canvas */}
        <div
          ref={canvasRef}
          className="relative mx-auto h-[60vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a1118]/80 backdrop-blur-sm cursor-grab active:cursor-grabbing pointer-events-auto"
        >
          {isVisible && (
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
              <HolographicConstellation />
              <ConnectionLines />
            </Canvas>
          )}

          {/* Skill labels overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="grid grid-cols-4 gap-4 text-center">
              {skills.map((skill, i) => (
                <div
                  key={skill}
                  className="text-xs font-mono text-[#3cd0bd]/60 opacity-50 hover:opacity-100 transition-opacity"
                  style={{
                    animation: `float ${3 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3cd0bd]/5 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#00b894]/5 rounded-full blur-3xl" />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#64748b]">
          Rotate to explore • Each node represents a core competency • Lines show interconnections
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}
