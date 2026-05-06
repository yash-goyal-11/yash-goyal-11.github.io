import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CONSTELLATION_SKILLS = [
  'Python', 'PyTorch', 'LangChain', 'LangGraph', 'Hugging Face', 'RAG',
  'Azure ML', 'AWS', 'Docker', 'Kubernetes', 'MLflow', 'Neo4j',
]

const CONSTELLATION_POINTS = CONSTELLATION_SKILLS.map((label, i) => {
  const angle = (i / CONSTELLATION_SKILLS.length) * Math.PI * 2
  const radius = 8
  return {
    label,
    position: new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.6,
      Math.sin(angle * 2) * 3
    ),
  }
})

function HolographicConstellation() {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!groupRef.current) return

    const positions = new Float32Array(CONSTELLATION_POINTS.length * 3)
    const colors = new Float32Array(CONSTELLATION_POINTS.length * 3)

    for (let i = 0; i < CONSTELLATION_POINTS.length; i++) {
      const point = CONSTELLATION_POINTS[i]
      positions[i * 3] = point.position.x
      positions[i * 3 + 1] = point.position.y
      positions[i * 3 + 2] = point.position.z

      const hue = 0.4 + (i / CONSTELLATION_POINTS.length) * 0.3
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

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = mouseRef.current.y * 0.35 + Math.sin(state.clock.elapsedTime * 0.3) * 0.15
      groupRef.current.rotation.y = mouseRef.current.x * 0.35 + state.clock.elapsedTime * 0.12
      groupRef.current.rotation.z += 0.0002
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} color="#3cd0bd" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3cd0bd" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00b894" />
    </group>
  )
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null)

  useFrame(() => {
    if (linesRef.current) {
      linesRef.current.rotation.z += 0.0001
    }
  })

  const points = CONSTELLATION_POINTS.map((point) => point.position)
  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []

  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length
    positions.push(points[i].x, points[i].y, points[i].z)
    positions.push(points[next].x, points[next].y, points[next].z)

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

function SkillLabels() {
  return (
    <group>
      {CONSTELLATION_POINTS.map((point) => (
        <Html
          key={point.label}
          position={[point.position.x, point.position.y, point.position.z]}
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
          transform
        >
          <div className="rounded-full border border-[#3cd0bd]/30 bg-[#030507]/70 px-3 py-1 text-xs text-[#3cd0bd] shadow-[0_0_12px_rgba(60,208,189,0.2)]">
            {point.label}
          </div>
        </Html>
      ))}
    </group>
  )
}

export default function SkillConstellation() {
  const sectionRef = useRef<HTMLDivElement>(null)
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

        <div className="relative mx-auto h-[60vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a1118]/80 backdrop-blur-sm cursor-grab active:cursor-grabbing pointer-events-auto">
          {isVisible && (
            <Canvas
              camera={{ position: [0, 0, 16], fov: 55 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            >
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.4}
                enableDamping
                dampingFactor={0.08}
                maxPolarAngle={Math.PI / 1.6}
                minPolarAngle={Math.PI / 4}
              />
              <HolographicConstellation />
              <ConnectionLines />
              <SkillLabels />
            </Canvas>
          )}

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3cd0bd]/5 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#00b894]/5 rounded-full blur-3xl" />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#64748b]">
          Rotate to explore • Each node represents a core competency • Lines show interconnections
        </p>
      </div>
    </section>
  )
}
