import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AICapabilityBadge } from '../components/AIVisualization'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  title: string
  subtitle: string
  description: string
  tech: string[]
  image: string
  highlights: string[]
}

const projects: Project[] = [
  {
    title: 'Agentic MLOps Monitor',
    subtitle: 'AI-Powered Production Monitoring',
    description:
      'An autonomous AI system on Azure ML that continuously monitors live model performance, detects drift, and triggers retraining pipelines.',
    tech: ['Python', 'Azure ML', 'LangChain', 'MLflow', 'FastAPI', 'Docker'],
    image: '/project-1-bg.jpg',
    highlights: [
      'Auto-detects data drift and concept drift',
      'LLM-generated diagnostic reports',
      'GitHub Actions CI/CD automation',
    ],
  },
  {
    title: 'Graph-QA Agent',
    subtitle: 'Knowledge-Graph Question Answering',
    description:
      'A full agentic AI pipeline for document ingestion, knowledge-graph construction, and LLM-powered retrieval with reasoning.',
    tech: ['Neo4j', 'LangGraph', 'Python', 'LLMs', 'Flask'],
    image: '/project-2-bg.jpg',
    highlights: [
      'Entity/relation extraction pipeline',
      'Cypher query generation',
      'REST API with test coverage',
    ],
  },
  {
    title: 'Real-Time Traffic Analysis',
    subtitle: 'Computer Vision at Scale',
    description:
      'Deployed vehicle detection to AWS with 95% accuracy and 30% latency reduction, plus ML forecasting for congestion prediction.',
    tech: ['Python', 'OpenCV', 'AWS', 'YOLOv5', 'Flask'],
    image: '/project-3-bg.jpg',
    highlights: [
      '95% vehicle detection accuracy',
      '~30% latency reduction',
      'ML congestion forecasting',
    ],
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const container = containerRef.current
      if (!track || !container) return

      // Calculate scroll distance
      const totalWidth = track.scrollWidth - container.offsetWidth

      // Horizontal scroll
      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 20%',
          end: () => `+=${totalWidth}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          markers: false,
        },
      })

      // Card entrance animations
      cardRefs.current.forEach((card) => {
        if (!card) return
        gsap.set(card, { opacity: 0.7, scale: 0.95 })
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.getById?.('horizontal') || undefined,
            start: 'left 80%',
            end: 'left 20%',
            scrub: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10"
    >
      <div className="py-16 text-center">
        <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
          Featured <span className="text-[#3cd0bd]">Projects</span>
        </h2>
        <p className="mt-4 text-[#64748b]">Scroll to explore</p>
      </div>

      <div ref={containerRef} className="relative h-screen overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full items-center gap-8 px-8 md:px-16"
          style={{ width: 'fit-content' }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el }}
              className="group relative h-[75vh] w-[85vw] shrink-0 overflow-hidden rounded-3xl md:w-[70vw]"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1118] via-[#0a1118]/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <div className="mb-4 flex items-center gap-3">
                  <div className="mb-2 text-sm font-medium tracking-wider text-[#3cd0bd] uppercase">
                    {project.subtitle}
                  </div>
                  <AICapabilityBadge />
                </div>
                <h3 className="font-display mb-4 text-3xl font-bold text-white md:text-4xl">
                  {project.title}
                </h3>
                <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="mb-6 space-y-1">
                  {project.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-[#e2e8f0]"
                    >
                      <svg
                        className="h-4 w-4 text-[#3cd0bd]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-[#1c3f3a]/50 px-4 py-1.5 text-xs font-medium text-[#3cd0bd] backdrop-blur-sm border border-[#3cd0bd]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 border-2 border-transparent transition-all duration-500 group-hover:border-[#3cd0bd]/20 rounded-3xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
