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
  github?: string
  demo?: string
  paper?: string
}

// TODO: replace GITHUB_USER if your handle differs from LinkedIn
const GITHUB_USER = 'yashgoyal11'

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
    github: `https://github.com/${GITHUB_USER}`,
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
    github: `https://github.com/${GITHUB_USER}`,
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
    github: `https://github.com/${GITHUB_USER}`,
  },
  {
    title: 'AI Heart Disease Prediction',
    subtitle: 'Clinical Risk Modeling',
    description:
      'Ensemble ML models with 90%+ accuracy using PCA/SMOTE, benchmarking against neural baselines to improve clinical risk scoring.',
    tech: ['Python', 'scikit-learn', 'XGBoost', 'Pandas'],
    image: '/project-1-bg.jpg',
    highlights: [
      '90%+ model accuracy',
      'PCA + SMOTE for class balance',
      'Benchmarked against neural baseline',
    ],
    github: `https://github.com/${GITHUB_USER}`,
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
      const endPadding = window.innerHeight * 0.2 // Reduced end padding for tighter scroll spacing

      // Horizontal scroll
      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'center center', // Pin perfectly in the middle
          end: () => `+=${totalWidth + endPadding}`,
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
      className="relative z-10 pb-10"
    >
      <div className="py-8 text-center">
        <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
          Featured <span className="text-[#3cd0bd]">Projects</span>
        </h2>
        <p className="mt-4 text-[#64748b]">Scroll to explore</p>
      </div>

      <div ref={containerRef} className="relative flex h-[85vh] w-full items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-fit items-center gap-8 px-8 md:px-16"
          style={{ width: 'fit-content' }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el }}
              className="group relative h-[65vh] w-[85vw] shrink-0 overflow-hidden rounded-3xl md:w-[70vw]"
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

                {/* Project links */}
                {(project.github || project.demo || project.paper) && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#e2e8f0] backdrop-blur-sm transition-all duration-300 hover:border-[#3cd0bd]/40 hover:bg-[#3cd0bd]/10 hover:text-[#3cd0bd]"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#e2e8f0] backdrop-blur-sm transition-all duration-300 hover:border-[#3cd0bd]/40 hover:bg-[#3cd0bd]/10 hover:text-[#3cd0bd]"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7M21 3l-9 9M5 5h6v2H7v10h10v-4h2v6H5z" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.paper && (
                      <a
                        href={project.paper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#e2e8f0] backdrop-blur-sm transition-all duration-300 hover:border-[#3cd0bd]/40 hover:bg-[#3cd0bd]/10 hover:text-[#3cd0bd]"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Paper
                      </a>
                    )}
                  </div>
                )}
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
