import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import SectionLabel from '../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

/* ── Graph data: real projects wired to the skills they actually use ── */
interface ProjectNode {
  id: string
  name: string
  skills: string[]
}

const PROJECTS: ProjectNode[] = [
  { id: 'mlmonitor', name: 'MLOps Monitor', skills: ['Python', 'Azure ML', 'LangGraph', 'MLflow'] },
  { id: 'asx', name: 'ASX RAG Agent', skills: ['Python', 'Claude', 'Qdrant', 'FastAPI'] },
  { id: 'tradie', name: 'Tradie Receptionist', skills: ['TypeScript', 'Twilio', 'Groq', 'Supabase'] },
  { id: 'graphqa', name: 'Graph-QA Agent', skills: ['Neo4j', 'LangGraph', 'Python', 'LLMs'] },
  { id: 'traffic', name: 'Traffic Analysis', skills: ['Python', 'OpenCV', 'AWS', 'YOLOv5'] },
  { id: 'heart', name: 'Heart Disease ML', skills: ['scikit-learn', 'XGBoost', 'Pandas', 'Python'] },
]

type V3 = [number, number, number]

interface GraphModel {
  projectPos: Record<string, THREE.Vector3>
  skillPos: Record<string, THREE.Vector3>
  skillToProjects: Record<string, string[]>
  edges: { pid: string; skill: string }[]
}

/** Deterministic layout: projects on a ring, shared skills pulled to the
 *  hub, unique skills fanned out beyond their owning project. */
function buildGraph(): GraphModel {
  const projectPos: Record<string, THREE.Vector3> = {}
  PROJECTS.forEach((p, i) => {
    const angle = (i / PROJECTS.length) * Math.PI * 2
    projectPos[p.id] = new THREE.Vector3(
      Math.cos(angle) * 7,
      Math.sin(angle) * 4.6,
      Math.sin(angle * 1.7) * 2
    )
  })

  const skillToProjects: Record<string, string[]> = {}
  PROJECTS.forEach((p) => {
    p.skills.forEach((s) => {
      ;(skillToProjects[s] ||= []).push(p.id)
    })
  })

  const skillPos: Record<string, THREE.Vector3> = {}
  Object.entries(skillToProjects).forEach(([name, pids], idx) => {
    if (pids.length > 1) {
      // Shared skill → hub near the centre, between its projects
      const pos = new THREE.Vector3()
      pids.forEach((pid) => pos.add(projectPos[pid]))
      pos.multiplyScalar(1 / pids.length).multiplyScalar(0.5)
      pos.z += (idx % 2 ? 1 : -1) * 1.2
      skillPos[name] = pos
    } else {
      // Unique skill → fan out beyond its single project
      const pid = pids[0]
      const base = projectPos[pid]
      const outward = base.clone().normalize()
      const tangent = new THREE.Vector3(-outward.y, outward.x, 0).normalize()
      const uniques = PROJECTS.find((p) => p.id === pid)!.skills.filter(
        (s) => skillToProjects[s].length === 1
      )
      const k = uniques.indexOf(name)
      const m = uniques.length
      const spread = k - (m - 1) / 2
      skillPos[name] = base
        .clone()
        .add(outward.multiplyScalar(3.4))
        .add(tangent.multiplyScalar(spread * 2.1))
      skillPos[name].z += (k % 2 ? 1 : -1) * 1.0
    }
  })

  const edges = PROJECTS.flatMap((p) => p.skills.map((skill) => ({ pid: p.id, skill })))
  return { projectPos, skillPos, skillToProjects, edges }
}

const GRAPH = buildGraph()

function NodeLabel({
  position,
  text,
  variant,
  active,
  onEnter,
  onLeave,
}: {
  position: THREE.Vector3
  text: string
  variant: 'project' | 'skill'
  active: boolean
  onEnter?: () => void
  onLeave?: () => void
}) {
  const isProject = variant === 'project'
  return (
    <Html position={position} center distanceFactor={undefined} zIndexRange={[20, 0]}>
      <div
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onEnter}
        style={{ cursor: isProject ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
        className={`select-none rounded-full border backdrop-blur-sm transition-all duration-200 ${
          isProject ? 'px-3 py-1 text-xs font-semibold' : 'px-2 py-0.5 text-[10px] font-medium'
        } ${
          active
            ? 'border-[#3cd0bd] bg-[#3cd0bd]/15 text-[#e2fbf6] shadow-[0_0_14px_rgba(60,208,189,0.4)]'
            : isProject
            ? 'border-[#3cd0bd]/40 bg-[#030507]/80 text-[#3cd0bd]'
            : 'border-white/10 bg-[#030507]/70 text-[#8b98ad]'
        }`}
      >
        {text}
      </div>
    </Html>
  )
}

function Graph({
  hovered,
  setHovered,
}: {
  hovered: string | null
  setHovered: (h: string | null) => void
}) {
  const projectHasSkill = (pid: string, skill: string) =>
    PROJECTS.find((p) => p.id === pid)?.skills.includes(skill) ?? false

  const isProjActive = (pid: string) => {
    if (!hovered) return false
    if (hovered === pid) return true
    if (hovered.startsWith('skill:')) return projectHasSkill(pid, hovered.slice(6))
    return false
  }
  const isSkillActive = (skill: string) => {
    if (!hovered) return false
    if (hovered === `skill:${skill}`) return true
    if (!hovered.startsWith('skill:')) return projectHasSkill(hovered, skill)
    return false
  }
  const isEdgeActive = (pid: string, skill: string) =>
    !!hovered && (hovered === pid || hovered === `skill:${skill}`)

  return (
    <group>
      {/* Edges */}
      {GRAPH.edges.map((e, i) => {
        const a = GRAPH.projectPos[e.pid]
        const b = GRAPH.skillPos[e.skill]
        const on = isEdgeActive(e.pid, e.skill)
        const points: V3[] = [
          [a.x, a.y, a.z],
          [b.x, b.y, b.z],
        ]
        return (
          <Line
            key={i}
            points={points}
            color="#3cd0bd"
            lineWidth={on ? 2 : 1}
            transparent
            opacity={hovered ? (on ? 0.85 : 0.03) : 0.16}
          />
        )
      })}

      {/* Skill nodes */}
      {Object.entries(GRAPH.skillPos).map(([name, pos]) => {
        const shared = GRAPH.skillToProjects[name].length > 1
        const active = isSkillActive(name)
        const dim = !!hovered && !active
        return (
          <group key={name}>
            <mesh
              position={pos}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(`skill:${name}`)
              }}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[shared ? 0.28 : 0.2, 16, 16]} />
              <meshBasicMaterial
                color={active ? '#e2fbf6' : shared ? '#3cd0bd' : '#5b8a86'}
                transparent
                opacity={dim ? 0.2 : 1}
              />
            </mesh>
            {/* Skill labels: only the hub skills by default; all active ones on hover */}
            {(active || (!hovered && shared)) && (
              <NodeLabel position={pos} text={name} variant="skill" active={active} />
            )}
          </group>
        )
      })}

      {/* Project nodes */}
      {PROJECTS.map((p) => {
        const pos = GRAPH.projectPos[p.id]
        const active = isProjActive(p.id)
        const dim = !!hovered && !active && hovered !== p.id
        return (
          <group key={p.id}>
            {/* glow */}
            <mesh position={pos}>
              <sphereGeometry args={[0.75, 16, 16]} />
              <meshBasicMaterial
                color="#3cd0bd"
                transparent
                opacity={dim ? 0.04 : active || hovered === p.id ? 0.22 : 0.1}
              />
            </mesh>
            <mesh
              position={pos}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(p.id)
              }}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[0.45, 24, 24]} />
              <meshBasicMaterial
                color={active || hovered === p.id ? '#00b894' : '#3cd0bd'}
                transparent
                opacity={dim ? 0.3 : 1}
              />
            </mesh>
            <NodeLabel
              position={new THREE.Vector3(pos.x, pos.y - 1.0, pos.z)}
              text={p.name}
              variant="project"
              active={active || hovered === p.id}
              onEnter={() => setHovered(p.id)}
              onLeave={() => setHovered(null)}
            />
          </group>
        )
      })}
    </group>
  )
}

export default function SkillConstellation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()

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
    <section id="constellation" ref={sectionRef} className="relative z-10 py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-4">
        <SectionLabel>Tech Graph</SectionLabel>
        <h2 className="font-display mb-4 text-center text-4xl font-bold text-white md:text-5xl">
          Skills <span className="text-[#3cd0bd]">×</span> Projects
        </h2>
        <p className="mb-8 text-center text-[#8b98ad]">
          Every skill wired to the projects I shipped it in — hover a node to trace the stack
        </p>

        <div className="relative mx-auto h-[60vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a1118]/80 backdrop-blur-sm">
          {isVisible && (
            <Canvas
              camera={{ position: [0, 0, 18], fov: 55 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            >
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={!reducedMotion && !hovered}
                autoRotateSpeed={0.5}
                enableDamping
                dampingFactor={0.08}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
              />
              <Graph hovered={hovered} setHovered={setHovered} />
            </Canvas>
          )}

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1.5 font-mono text-[10px] text-[#8b98ad]">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3cd0bd]" /> Project
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#5b8a86]" /> Skill / tool
            </span>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3cd0bd]/5 blur-3xl" />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#8b98ad]">
          Hub nodes (Python, LangGraph) power multiple projects · drag to rotate
        </p>
      </div>
    </section>
  )
}
