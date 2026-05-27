import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useReducedMotion } from '../hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

interface SkillSection {
  id: string
  label: string
  summary: string
  skills: string[]
}

const skillSections: SkillSection[] = [
  {
    id: 'ai-ml',
    label: 'AI / ML',
    summary: 'Production-grade modeling, LLM agents, and applied research.',
    skills: [
      'Python',
      'PyTorch',
      'TensorFlow',
      'LLMs',
      'LangChain',
      'LangGraph',
      'Hugging Face',
      'RAG Systems',
      'XGBoost',
      'LightGBM',
      'Computer Vision',
    ],
  },
  {
    id: 'cloud-mlops',
    label: 'Cloud + MLOps',
    summary: 'Cloud-native delivery, monitoring, and automated retraining.',
    skills: [
      'Azure ML',
      'AWS',
      'GCP',
      'Docker',
      'Kubernetes',
      'MLflow',
      'CI/CD',
      'Terraform',
      'SAS Viya',
    ],
  },
  {
    id: 'data-engineering',
    label: 'Data + Pipelines',
    summary: 'Reliable data systems, APIs, and analytics pipelines.',
    skills: [
      'SQL',
      'Pandas',
      'NumPy',
      'Neo4j',
      'FastAPI',
      'Flask',
      'REST APIs',
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    summary: 'Clean code, testing culture, and collaboration practices.',
    skills: [
      'Clean Code',
      'Test-Driven Dev',
      'Code Review',
      'Git/GitHub',
      'Agile/Scrum',
    ],
  },
]

const skillMatrix = [
  { category: 'AI/ML + GenAI', score: 92 },
  { category: 'Cloud + MLOps', score: 85 },
  { category: 'Data + Pipelines', score: 88 },
  { category: 'Engineering', score: 90 },
  { category: 'Research', score: 78 },
]

const categorySectionMap: Record<string, string> = {
  'AI/ML + GenAI': 'ai-ml',
  'Cloud + MLOps': 'cloud-mlops',
  'Data + Pipelines': 'data-engineering',
  Engineering: 'engineering',
  Research: 'ai-ml',
}

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const reactorRef = useRef<HTMLDivElement>(null)
  const [activeSectionId, setActiveSectionId] = useState('ai-ml')
  const activeSection = skillSections.find((section) => section.id === activeSectionId) ?? skillSections[0]
  const reducedMotion = useReducedMotion()
  const [reactorBurst, setReactorBurst] = useState(0)
  const [reactorTilt, setReactorTilt] = useState({ x: 0, y: 0 })
  const [reactorMode, setReactorMode] = useState<'RESEARCH' | 'DEPLOY'>('RESEARCH')
  const [reactorSparks, setReactorSparks] = useState<Array<{ id: number; x: number; y: number }>>([])
  const reactorStats = [
    { label: 'Agentic MLOps', value: '99.2%', note: 'Drift coverage' },
    { label: 'Graph-QA', value: '42k', note: 'Edges indexed' },
    { label: 'Realtime CV', value: '18ms', note: 'Median latency' },
    { label: 'Reliability', value: 'SLO 99.9', note: 'Uptime target' },
  ]

  useEffect(() => {
    if (reducedMotion) {
      gsap.set(headingRef.current, { opacity: 1, y: 0 })
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, y: 0, rotateY: 0 })
      })
      return
    }

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.set(headingRef.current, { opacity: 0, y: 40 })
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })

      // Card animations with stagger
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.set(card, {
          opacity: 0,
          y: 50 + (i % 3) * 20,
          rotateY: -15 + (i % 2) * 30,
        })

        gsap.to(card, {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          delay: (i % 4) * 0.1,
        })
      })

      // Grid 3D rotation on scroll
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          rotateY: 10,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (reducedMotion) return
    const card = cardRefs.current[index]
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = (index: number) => {
    if (reducedMotion) return
    const card = cardRefs.current[index]
    if (!card) return

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  const handleReactorMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setReactorTilt({ x: x * 12, y: y * -12 })
  }

  const handleReactorLeave = () => {
    setReactorTilt({ x: 0, y: 0 })
  }

  const triggerReactorBurst = () => {
    setReactorBurst((prev) => prev + 1)
    setReactorMode((prev) => (prev === 'RESEARCH' ? 'DEPLOY' : 'RESEARCH'))

    // Visual sparks only — numbers stay stable so they read as real metrics
    const sparks = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
    }))
    setReactorSparks(sparks)
    window.setTimeout(() => setReactorSparks([]), 900)
  }

  const renderRadarTick = (props: { x: number; y: number; payload: { value: string } }) => {
    const { x, y, payload } = props
    const sectionId = categorySectionMap[payload.value]
    const isActive = sectionId === activeSectionId

    return (
      <g
        transform={`translate(${x},${y})`}
        onClick={() => sectionId && setActiveSectionId(sectionId)}
        style={{ cursor: sectionId ? 'pointer' : 'default' }}
      >
        <text
          textAnchor="middle"
          fill={isActive ? '#3cd0bd' : '#94a3b8'}
          fontSize={12}
        >
          {payload.value}
        </text>
      </g>
    )
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative z-10 px-4 py-32 md:py-48"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          ref={headingRef}
          className="font-display mb-4 text-center text-4xl font-bold text-white md:text-5xl opacity-0"
        >
          The <span className="text-[#3cd0bd]">Skill</span> Matrix
        </h2>
        <p className="mb-12 text-center text-[#64748b]">
          Core technologies powering my production ML and GenAI systems
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {skillSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                section.id === activeSectionId
                  ? 'border-[#3cd0bd]/60 bg-[#3cd0bd]/10 text-[#3cd0bd] shadow-[0_0_18px_rgba(60,208,189,0.2)]'
                  : 'border-white/10 bg-white/5 text-[#94a3b8] hover:border-[#3cd0bd]/30 hover:text-[#3cd0bd]'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="mb-6 text-center text-sm text-[#94a3b8]">
          {activeSection.summary}
        </div>

        <div
          ref={gridRef}
          className="perspective-1000 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 preserve-3d"
        >
          {activeSection.skills.map((skill, index) => (
            <div
              key={skill}
              ref={(el) => { cardRefs.current[index] = el }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className="skill-card-3d group cursor-pointer"
            >
              <div className="glass-card relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 group-hover:border-[#3cd0bd]/40">
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-[#3cd0bd]/5 to-[#00b894]/5" />
                
                <div className="relative z-10">
                  <div className="mb-2 text-xs font-medium tracking-wider text-[#3cd0bd] uppercase">
                    {activeSection.label}
                  </div>
                  <div className="font-display text-lg font-semibold text-white group-hover:text-[#3cd0bd] transition-colors">
                    {skill}
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-tl-lg bg-gradient-to-tl from-[#3cd0bd]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="mb-4 text-sm font-medium tracking-wider text-[#3cd0bd] uppercase">
              Skill Matrix Radar
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillMatrix} margin={{ top: 12, right: 24, bottom: 12, left: 24 }}>
                  <PolarGrid stroke="rgba(60, 208, 189, 0.2)" />
                  <PolarAngleAxis dataKey="category" tick={renderRadarTick} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Radar
                    dataKey="score"
                    stroke="#3cd0bd"
                    fill="rgba(60, 208, 189, 0.25)"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(3, 5, 7, 0.9)',
                      border: '1px solid rgba(60, 208, 189, 0.2)',
                      color: '#e2e8f0',
                      borderRadius: 12,
                    }}
                    formatter={(value: number) => [`${value}%`, 'Strength']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-[#64748b]">
              Strengths reflect production experience, research output, and shipping velocity.
            </p>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="mb-4 text-sm font-medium tracking-wider text-[#3cd0bd] uppercase">
              Focus Areas
            </div>
            <ul className="space-y-3 text-sm text-[#94a3b8]">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3cd0bd]" />
                LLM agents, RAG pipelines, and knowledge-graph QA systems in production.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3cd0bd]" />
                Cloud-native MLOps: CI/CD, MLflow, monitoring, and automated retraining.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3cd0bd]" />
                GPU-accelerated pipelines and real-time inference for high-throughput systems.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3cd0bd]" />
                Clean engineering discipline with test-driven, modular codebases.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-white/5">
          <h3 className="mb-8 text-center text-2xl font-bold text-white">
            <span className="text-[#3cd0bd]">Signal</span> Reactor
          </h3>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1.2fr]">
            <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-8">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#3cd0bd]/10 blur-3xl" />
              <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-[#00b894]/10 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.3em] text-[#3cd0bd]">
                    Live Signal Feed
                  </div>
                  <h4 className="mt-2 text-2xl font-semibold text-white">AI Systems in Orbit</h4>
                  <p className="mt-3 text-sm text-[#94a3b8]">
                    A kinetic control room that tracks the systems I ship: agentic monitoring,
                    knowledge graphs, and real-time inference loops.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {reactorStats.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-[#0a1118]/60 p-4">
                      <div className="text-xs uppercase tracking-wider text-[#64748b]">{item.label}</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                      <div className="mt-1 text-xs text-[#3cd0bd]">{item.note}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-[#94a3b8]">
                  {['Azure ML', 'LangGraph', 'Neo4j', 'MLflow', 'GPU Pipelines', 'FastAPI'].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={reactorRef}
              onMouseMove={handleReactorMove}
              onMouseLeave={handleReactorLeave}
              onClick={triggerReactorBurst}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a1118]/70 p-8 cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${reactorTilt.y}deg) rotateY(${reactorTilt.x}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
              data-burst={reactorBurst}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,208,189,0.12),transparent_65%)]" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center">
                <div className="relative h-72 w-72">
                  {['ring-a', 'ring-b', 'ring-c'].map((ring) => (
                    <div key={ring} className={`absolute inset-0 rounded-full border border-[#3cd0bd]/30 ${ring}`} />
                  ))}
                  <div className="absolute inset-10 rounded-full border border-[#00b894]/30 ring-orbit" />
                  <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3cd0bd]/20 blur-sm core-glow" />
                  <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3cd0bd] shadow-[0_0_25px_rgba(60,208,189,0.8)] core-core" />
                  <div className="absolute inset-0 rounded-full border border-[#3cd0bd]/30 burst-ring" />
                  {reactorSparks.map((spark) => (
                    <div
                      key={spark.id}
                      className="absolute h-1.5 w-1.5 rounded-full bg-[#3cd0bd] spark"
                      style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
                    />
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 text-center text-xs text-[#94a3b8]">
                  {[
                    'Signal: ACTIVE',
                    `Mode: ${reactorMode}`,
                    'Throughput: 9.2 gb/s',
                    `Agents: ${10 + (reactorBurst % 6)} live`,
                  ].map((line) => (
                    <div key={line} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {[
                { text: 'Agentic Loop', style: 'top-10 left-8' },
                { text: 'Graph-QA', style: 'top-20 right-10' },
                { text: 'RAG Core', style: 'bottom-24 left-10' },
                { text: 'Realtime', style: 'bottom-16 right-8' },
              ].map((item, index) => (
                <div
                  key={item.text}
                  className={`absolute ${item.style} rounded-full border border-[#3cd0bd]/30 bg-[#030507]/70 px-3 py-1 text-xs text-[#3cd0bd] shadow-[0_0_12px_rgba(60,208,189,0.25)] float-tag-${index}`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes skill-stream {
          0% { transform: translateX(-60%); opacity: 0.6; }
          50% { opacity: 1; }
          100% { transform: translateX(160%); opacity: 0.6; }
        }
        .animate-skill-stream {
          animation: skill-stream 3.5s ease-in-out infinite;
        }
        .ring-a {
          animation: spin-slow 18s linear infinite;
        }
        .ring-b {
          inset: 18px;
          border-style: dashed;
          animation: spin-reverse 22s linear infinite;
        }
        .ring-c {
          inset: 36px;
          animation: spin-slow 26s linear infinite;
        }
        .ring-orbit {
          animation: pulse-orbit 4s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-orbit {
          0%, 100% { opacity: 0.4; transform: scale(0.98); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .burst-ring {
          opacity: 0;
        }
        [data-burst] .burst-ring {
          animation: burst 1.2s ease-out forwards;
        }
        @keyframes burst {
          0% { opacity: 0.7; transform: scale(0.6); }
          60% { opacity: 0.4; }
          100% { opacity: 0; transform: scale(1.4); }
        }
        .core-glow {
          animation: core-pulse 3s ease-in-out infinite;
        }
        .core-core {
          animation: core-flicker 2.4s ease-in-out infinite;
        }
        .spark {
          animation: spark 0.9s ease-out forwards;
        }
        @keyframes spark {
          0% { transform: scale(0.6); opacity: 0.6; }
          70% { transform: scale(1.6); opacity: 1; }
          100% { transform: scale(0.2); opacity: 0; }
        }
        @keyframes core-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
        @keyframes core-flicker {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.6; }
        }
        ${[0, 1, 2, 3].map((i) => `
          .float-tag-${i} {
            animation: float-tag 4.${i + 1}s ease-in-out infinite;
          }
        `).join('')}
        @keyframes float-tag {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}
