import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DataPipeline3D, NeuralNetwork3D } from '../components/Visualization3D'

gsap.registerPlugin(ScrollTrigger)

interface Skill {
  name: string
  category: string
  level?: number
}

const skills: Skill[] = [
  { name: 'Python', category: 'Language' },
  { name: 'PyTorch', category: 'ML/AI' },
  { name: 'TensorFlow', category: 'ML/AI' },
  { name: 'LangChain', category: 'GenAI' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Neo4j', category: 'Database' },
  { name: 'SQL', category: 'Database' },
  { name: 'Computer Vision', category: 'ML/AI' },
  { name: 'NVIDIA Omniverse', category: 'ML/AI' },
]

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
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
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
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
        <p className="mb-16 text-center text-[#64748b]">
          Core technologies I work with daily
        </p>

        <div
          ref={gridRef}
          className="perspective-1000 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 preserve-3d"
        >
          {skills.map((skill, index) => (
            <div
              key={skill.name}
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
                    {skill.category}
                  </div>
                  <div className="font-display text-lg font-semibold text-white group-hover:text-[#3cd0bd] transition-colors">
                    {skill.name}
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-tl-lg bg-gradient-to-tl from-[#3cd0bd]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        {/* AI Model Visualization Showcase */}
        <div className="mt-20 pt-12 border-t border-white/5">
          <h3 className="mb-8 text-center text-2xl font-bold text-white">
            <span className="text-[#3cd0bd]">AI Systems</span> in 3D
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataPipeline3D />
            <NeuralNetwork3D />
          </div>
        </div>
      </div>
    </section>
  )
}
