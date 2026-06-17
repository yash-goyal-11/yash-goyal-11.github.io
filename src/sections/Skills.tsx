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
import SectionLabel from '../components/SectionLabel'

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
  const [activeSectionId, setActiveSectionId] = useState('ai-ml')
  const activeSection = skillSections.find((section) => section.id === activeSectionId) ?? skillSections[0]
  const reducedMotion = useReducedMotion()

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
        <SectionLabel>Skills</SectionLabel>
        <h2
          ref={headingRef}
          className="font-display mb-4 text-center text-4xl font-bold text-white md:text-5xl opacity-0"
        >
          The <span className="text-[#3cd0bd]">Skill</span> Matrix
        </h2>
        <p className="mb-12 text-center text-[#8b98ad]">
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
                    tick={{ fill: '#8b98ad', fontSize: 10 }}
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
            <p className="mt-4 text-xs text-[#8b98ad]">
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

      </div>
    </section>
  )
}
