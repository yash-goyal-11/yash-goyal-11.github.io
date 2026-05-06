import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// 3D Holographic Data Pipeline
function DataPipelineVisualization() {
  const sceneRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  const stages = [
    { label: 'Input', color: '#3cd0bd' },
    { label: 'Process', color: '#a29bfe' },
    { label: 'Train', color: '#0984e3' },
    { label: 'Output', color: '#00b894' },
  ]

  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += 0.0015
      sceneRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    }
    camera.position.z = 18
  })

  return (
    <group ref={sceneRef}>
      {stages.map((stage, index) => {
        const xPos = (index - 1.5) * 6
        const colorNum = parseInt(stage.color.slice(1), 16)

        return (
          <group key={stage.label} position={[xPos, 0, 0]}>
            {/* Stage box */}
            <mesh>
              <boxGeometry args={[3, 3, 3]} />
              <meshStandardMaterial
                color={colorNum}
                emissive={colorNum}
                emissiveIntensity={0.5}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Wireframe */}
            <mesh>
              <boxGeometry args={[3.1, 3.1, 3.1]} />
              <meshBasicMaterial
                color={colorNum}
                wireframe
                transparent
                opacity={0.3}
              />
            </mesh>

            {/* Pulsing sphere */}
            <mesh position={[0, 0, 2]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial
                color={colorNum}
                emissive={colorNum}
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        )
      })}

      {/* Connection tubes */}
      {stages.map((_, index) => {
        if (index === stages.length - 1) return null
        const startX = (index - 1.5) * 6
        const endX = (index - 0.5) * 6

        return (
          <group key={`tube-${index}`}>
            <mesh position={[(startX + endX) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, endX - startX, 16]} />
              <meshStandardMaterial
                color="#3cd0bd"
                emissive="#3cd0bd"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        )
      })}

      {/* Ambient lighting */}
      <ambientLight intensity={0.6} color="#3cd0bd" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3cd0bd" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00b894" />
    </group>
  )
}

// 3D Neural Network Nodes
function NeuralNetworkVisualization() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
      groupRef.current.rotation.y += 0.0008
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.08
    }
  })

  const layers = 3
  const nodesPerLayer = 5
  const positions: { x: number; y: number; z: number; color: string }[] = []

  for (let layer = 0; layer < layers; layer++) {
    for (let node = 0; node < nodesPerLayer; node++) {
      const x = (layer - 1) * 6
      const y = (node - (nodesPerLayer - 1) / 2) * 2
      const z = Math.sin((layer + node) * 0.5) * 2
      const hue = ((layer * nodesPerLayer + node) / (layers * nodesPerLayer)) * 360
      positions.push({ x, y, z, color: `hsl(${hue}, 100%, 50%)` })
    }
  }

  return (
    <group ref={groupRef}>
      {/* Render nodes */}
      {positions.map((pos, i) => {
        const colorNum = parseInt(
          ['#3cd0bd', '#a29bfe', '#0984e3', '#00b894', '#ffd93d'][i % 5].slice(1),
          16
        )

        return (
          <mesh key={i} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={colorNum}
              emissive={colorNum}
              emissiveIntensity={0.7}
              metalness={0.8}
            />
            {/* Glow sphere */}
            <mesh scale={1.5}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color={colorNum}
                transparent
                opacity={0.1}
              />
            </mesh>
          </mesh>
        )
      })}

      {/* Connection lines between layers */}
      {Array.from({ length: nodesPerLayer * (nodesPerLayer - 1) / 2 }).map((_, i) => {
        const pos1 = positions[i]
        const pos2 = positions[i + nodesPerLayer]

        if (!pos1 || !pos2) return null

        const points = [
          new THREE.Vector3(pos1.x, pos1.y, pos1.z),
          new THREE.Vector3(pos2.x, pos2.y, pos2.z),
        ]

        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const LineComponent = 'line' as any

        return (
          <LineComponent key={`line-${i}`} geometry={geometry}>
            <lineBasicMaterial color="#3cd0bd" transparent opacity={0.3} linewidth={1} />
          </LineComponent>
        )
      })}

      <ambientLight intensity={0.5} color="#3cd0bd" />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  )
}

export function DataPipeline3D() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="rounded-lg border border-[#3cd0bd]/20 bg-[#0a1118]/50 p-4 backdrop-blur-sm h-[300px] cursor-grab active:cursor-grabbing pointer-events-auto relative z-10">
      <div className="text-[#64748b] text-xs mb-2">3D Data Pipeline</div>
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 20], fov: 55 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 3.5}
          />
          <DataPipelineVisualization />
        </Canvas>
      )}
    </div>
  )
}

export function NeuralNetwork3D() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="rounded-lg border border-[#3cd0bd]/20 bg-[#0a1118]/50 p-4 backdrop-blur-sm h-[300px] cursor-grab active:cursor-grabbing pointer-events-auto relative z-10">
      <div className="text-[#64748b] text-xs mb-2">3D Neural Network</div>
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 18], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            enableDamping
            dampingFactor={0.1}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 3.5}
          />
          <NeuralNetworkVisualization />
        </Canvas>
      )}
    </div>
  )
}

export default function Visualization3D() {
  return (
    <div className="space-y-4">
      <DataPipeline3D />
      <NeuralNetwork3D />
    </div>
  )
}
