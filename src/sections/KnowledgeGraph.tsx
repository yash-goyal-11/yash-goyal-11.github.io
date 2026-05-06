import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GraphNode {
  id: string
  label: string
  type: 'skill' | 'project' | 'experience' | 'core'
  position: THREE.Vector3
  velocity: THREE.Vector3
  mass: number
}

interface GraphEdge {
  source: string
  target: string
  strength: number
}

const nodes: GraphNode[] = [
  { id: 'yash', label: 'Yash Goyal', type: 'core', position: new THREE.Vector3(0, 0, 0), velocity: new THREE.Vector3(), mass: 5 },
  // Skills
  { id: 'python', label: 'Python', type: 'skill', position: new THREE.Vector3(5, 2, 1), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'pytorch', label: 'PyTorch', type: 'skill', position: new THREE.Vector3(4, -2, 3), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'langchain', label: 'LangChain', type: 'skill', position: new THREE.Vector3(-4, 3, 2), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'langgraph', label: 'LangGraph', type: 'skill', position: new THREE.Vector3(-6, 1, 1), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'azureml', label: 'Azure ML', type: 'skill', position: new THREE.Vector3(-3, -3, -1), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'aws', label: 'AWS', type: 'skill', position: new THREE.Vector3(-1, -4, -2), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'docker', label: 'Docker', type: 'skill', position: new THREE.Vector3(3, 4, -2), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'kubernetes', label: 'Kubernetes', type: 'skill', position: new THREE.Vector3(2, 6, -1), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'mlflow', label: 'MLflow', type: 'skill', position: new THREE.Vector3(1, -5, 2), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'neo4j', label: 'Neo4j', type: 'skill', position: new THREE.Vector3(-5, 1, -3), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'fastapi', label: 'FastAPI', type: 'skill', position: new THREE.Vector3(-2, 5, 1), velocity: new THREE.Vector3(), mass: 2 },
  { id: 'cv', label: 'Computer Vision', type: 'skill', position: new THREE.Vector3(6, 0, -2), velocity: new THREE.Vector3(), mass: 2 },
  // Projects
  { id: 'mlops', label: 'Agentic MLOps Monitor', type: 'project', position: new THREE.Vector3(8, 3, 0), velocity: new THREE.Vector3(), mass: 3 },
  { id: 'graphqa', label: 'Graph-QA Agent', type: 'project', position: new THREE.Vector3(-7, 2, 3), velocity: new THREE.Vector3(), mass: 3 },
  { id: 'traffic', label: 'Traffic Analysis', type: 'project', position: new THREE.Vector3(5, -5, -1), velocity: new THREE.Vector3(), mass: 3 },
  { id: 'heart', label: 'Heart Disease Prediction', type: 'project', position: new THREE.Vector3(7, -4, 3), velocity: new THREE.Vector3(), mass: 3 },
  // Experience
  { id: 'sas', label: 'SAS Institute', type: 'experience', position: new THREE.Vector3(-6, -3, -2), velocity: new THREE.Vector3(), mass: 3 },
  { id: 'airlab', label: 'AirLabOne', type: 'experience', position: new THREE.Vector3(7, -2, 3), velocity: new THREE.Vector3(), mass: 3 },
  { id: 'usyd', label: 'USYD Tutor', type: 'experience', position: new THREE.Vector3(-3, 6, -2), velocity: new THREE.Vector3(), mass: 3 },
  { id: 'iit', label: 'IIT Madras', type: 'experience', position: new THREE.Vector3(0, 7, 2), velocity: new THREE.Vector3(), mass: 3 },
]

const edges: GraphEdge[] = [
  { source: 'yash', target: 'python', strength: 1 },
  { source: 'yash', target: 'pytorch', strength: 1 },
  { source: 'yash', target: 'langchain', strength: 1 },
  { source: 'yash', target: 'langgraph', strength: 1 },
  { source: 'yash', target: 'azureml', strength: 1 },
  { source: 'yash', target: 'aws', strength: 1 },
  { source: 'yash', target: 'docker', strength: 1 },
  { source: 'yash', target: 'neo4j', strength: 1 },
  { source: 'python', target: 'pytorch', strength: 0.5 },
  { source: 'python', target: 'fastapi', strength: 0.5 },
  { source: 'langchain', target: 'neo4j', strength: 0.7 },
  { source: 'langgraph', target: 'graphqa', strength: 0.9 },
  { source: 'azureml', target: 'mlops', strength: 0.8 },
  { source: 'mlflow', target: 'mlops', strength: 0.7 },
  { source: 'docker', target: 'mlops', strength: 0.8 },
  { source: 'python', target: 'mlops', strength: 0.7 },
  { source: 'neo4j', target: 'graphqa', strength: 0.9 },
  { source: 'cv', target: 'traffic', strength: 0.9 },
  { source: 'aws', target: 'traffic', strength: 0.7 },
  { source: 'python', target: 'heart', strength: 0.7 },
  { source: 'sas', target: 'azureml', strength: 0.6 },
  { source: 'sas', target: 'docker', strength: 0.5 },
  { source: 'airlab', target: 'pytorch', strength: 0.7 },
  { source: 'airlab', target: 'cv', strength: 0.6 },
  { source: 'usyd', target: 'python', strength: 0.6 },
  { source: 'iit', target: 'fastapi', strength: 0.5 },
]

const NODE_COLORS: Record<string, number> = {
  core: 0x3cd0bd,
  skill: 0x00b894,
  project: 0xa29bfe,
  experience: 0x0984e3,
}

function NodeMesh({ node, onHover, onLeave, hovered }: {
  node: GraphNode
  onHover: (node: GraphNode) => void
  onLeave: () => void
  hovered: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetScale = hovered ? 1.5 : 1

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(node.position, 0.1)
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const color = NODE_COLORS[node.type]
  const size = node.type === 'core' ? 1.2 : 0.6

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(node)
      }}
      onPointerOut={onLeave}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.8 : 0.3}
        roughness={0.3}
        metalness={0.7}
      />
      {/* Glow ring */}
      <mesh scale={hovered ? 1.8 : 1.4}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={hovered ? 0.15 : 0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  )
}

function EdgeLine({ source, target }: { source: GraphNode; target: GraphNode }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(6)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame(() => {
    const positions = geometry.attributes.position.array as Float32Array
    positions[0] = source.position.x
    positions[1] = source.position.y
    positions[2] = source.position.z
    positions[3] = target.position.x
    positions[4] = target.position.y
    positions[5] = target.position.z
    geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={0x1c3f3a} transparent opacity={0.4} />
    </lineSegments>
  )
}

function GraphScene({ onNodeHover }: { onNodeHover: (node: GraphNode | null) => void }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const { camera } = useThree()

  // Physics simulation
  useFrame(() => {
    const repulsionForce = 80
    const attractionForce = 0.02
    const damping = 0.92
    const centerForce = 0.005

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const diff = nodes[i].position.clone().sub(nodes[j].position)
        const dist = diff.length()
        if (dist < 0.1) continue
        const force = diff.normalize().multiplyScalar(repulsionForce / (dist * dist))
        nodes[i].velocity.add(force.divideScalar(nodes[i].mass))
        nodes[j].velocity.sub(force.divideScalar(nodes[j].mass))
      }
    }

    // Attraction along edges
    edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source)
      const target = nodes.find((n) => n.id === edge.target)
      if (!source || !target) return
      const diff = target.position.clone().sub(source.position)
      const dist = diff.length()
      const force = diff.normalize().multiplyScalar(dist * attractionForce * edge.strength)
      source.velocity.add(force.divideScalar(source.mass))
      target.velocity.sub(force.divideScalar(target.mass))
    })

    // Pull to center
    nodes.forEach((node) => {
      const toCenter = new THREE.Vector3(0, 0, 0).sub(node.position)
      node.velocity.add(toCenter.multiplyScalar(centerForce))
      node.velocity.multiplyScalar(damping)
      node.position.add(node.velocity)
    })
  })

  // Auto-rotate camera
  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.1
    camera.position.x = Math.sin(time) * 20
    camera.position.z = Math.cos(time) * 20
    camera.lookAt(0, 0, 0)
  })

  const handleHover = useCallback((node: GraphNode) => {
    setHoveredNode(node.id)
    onNodeHover(node)
  }, [onNodeHover])

  const handleLeave = useCallback(() => {
    setHoveredNode(null)
    onNodeHover(null)
  }, [onNodeHover])

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={0x3cd0bd} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={0x00b894} />

      {nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          onHover={handleHover}
          onLeave={handleLeave}
          hovered={hoveredNode === node.id}
        />
      ))}

      {edges.map((edge, index) => {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
        if (!source || !target) return null
        return <EdgeLine key={index} source={source} target={target} />
      })}
    </>
  )
}

export default function KnowledgeGraph() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
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

  const getConnectedNodes = (nodeId: string) => {
    return edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => {
        const id = e.source === nodeId ? e.target : e.source
        return nodes.find((n) => n.id === id)
      })
      .filter(Boolean) as GraphNode[]
  }

  return (
    <section
      id="graph"
      ref={sectionRef}
      className="relative z-10 py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="font-display mb-4 text-center text-4xl font-bold text-white md:text-5xl">
          My <span className="text-[#3cd0bd]">Knowledge</span> Graph
        </h2>
        <p className="mb-8 text-center text-[#64748b]">
          An interactive force-directed graph of my skills, projects, and experience.
          <br />
          <span className="text-sm">Drag to rotate, hover nodes to explore connections.</span>
        </p>

        <div
          ref={canvasRef}
          className="relative mx-auto h-[60vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a1118]/80 backdrop-blur-sm"
        >
          {isVisible && (
            <Canvas 
              camera={{ position: [0, 0, 20], fov: 60 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <GraphScene onNodeHover={setHoveredNode} />
            </Canvas>
          )}

          {/* Hover info panel */}
          {hoveredNode && (
            <div className="absolute bottom-6 left-6 z-20 max-w-xs rounded-xl border border-[#3cd0bd]/20 bg-[#030507]/90 p-4 backdrop-blur-xl">
              <div className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: '#' + NODE_COLORS[hoveredNode.type].toString(16).padStart(6, '0') }}>
                {hoveredNode.type}
              </div>
              <div className="mb-2 text-lg font-semibold text-white">
                {hoveredNode.label}
              </div>
              {hoveredNode.type !== 'core' && (
                <div className="text-xs text-[#64748b]">
                  Connected to: {getConnectedNodes(hoveredNode.id).map((n) => n.label).join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="absolute right-6 top-6 z-20 rounded-xl border border-white/10 bg-[#030507]/80 p-4 backdrop-blur-sm">
            <div className="space-y-2 text-xs">
              {[
                { type: 'core', label: 'Core' },
                { type: 'skill', label: 'Skills' },
                { type: 'project', label: 'Projects' },
                { type: 'experience', label: 'Experience' },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: '#' + NODE_COLORS[item.type].toString(16).padStart(6, '0') }}
                  />
                  <span className="text-[#94a3b8]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#64748b]">
          This is how I think about my expertise — interconnected, not isolated. Every skill feeds into projects, 
          and every experience deepens my capabilities.
        </p>
      </div>
    </section>
  )
}
