import { useEffect, useRef, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

const SlimeCanvas = lazy(() => import('../components/SlimeCanvas'))

function SlimeFallback() {
  return (
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1c3f3a]/60 via-[#3cd0bd]/15 to-transparent" />
  )
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      gsap.set([headingRef.current, bodyRef.current, statsRef.current], {
        opacity: 1,
        y: 0,
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, bodyRef.current, statsRef.current], {
        opacity: 0,
        y: 40,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
        .to(
          bodyRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  const stats = [
    { value: '4+', label: 'Years Experience' },
    { value: '2', label: 'Publications' },
    { value: '3', label: 'Hackathon Wins' },
    { value: '5+', label: 'Projects' },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 px-4 py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <h2
              ref={headingRef}
              className="font-display mb-8 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl opacity-0"
            >
              Turning Data
              <br />
              <span className="text-[#3cd0bd]">into Decisions</span>
            </h2>

            <p
              ref={bodyRef}
              className="mb-10 text-lg leading-relaxed text-[#94a3b8] opacity-0"
            >
              I build production-grade AI systems end to end, from LLM-powered agents
              and knowledge-graph QA pipelines to GPU-accelerated ML pipelines in live
              environments. My work blends rigorous engineering with applied research,
              delivering reliable systems that scale. Currently interning at{' '}
              <strong className="text-[#e2e8f0]">SAS Institute</strong> and tutoring at the{' '}
              <strong className="text-[#e2e8f0]">University of Sydney</strong>, I collaborate
              across teams to translate business goals into measurable outcomes.
            </p>

            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-6 sm:grid-cols-4 opacity-0"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card rounded-xl p-4 text-center transition-all duration-300 hover:border-[#3cd0bd]/30"
                >
                  <div className="font-display text-3xl font-bold text-[#3cd0bd]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs tracking-wider text-[#64748b] uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Slime Shader (lazy-loaded; static fallback under reduced-motion) */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1c3f3a]/20 to-transparent" />
              {reducedMotion ? (
                <SlimeFallback />
              ) : (
                <Suspense fallback={<SlimeFallback />}>
                  <SlimeCanvas />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
