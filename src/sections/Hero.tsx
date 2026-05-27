import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/use-reduced-motion'

const floatingSkills = [
  'Python', 'LangChain', 'LangGraph', 'Azure ML', 'AWS',
  'Docker', 'Kubernetes', 'MLflow', 'Neo4j',
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      gsap.set(
        [nameRef.current, subtitleRef.current, taglineRef.current, ctaRef.current],
        { opacity: 1, y: 0 }
      )
      orbsRef.current.forEach((orb) => {
        if (orb) gsap.set(orb, { opacity: 1, scale: 1 })
      })
      return
    }

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([nameRef.current, subtitleRef.current, taglineRef.current], {
        opacity: 0,
        y: 60,
      })
      gsap.set(ctaRef.current, { opacity: 0, y: 30 })

      // Faster than the original 0.5s so the first paint isn't a blank hero
      const tl = gsap.timeline({ delay: 0.1 })

      tl.to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        )

      // Continuous glow pulse
      gsap.to(nameRef.current, {
        textShadow: '0 0 30px rgba(60, 208, 189, 0.6), 0 0 60px rgba(60, 208, 189, 0.2)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Floating orbs animation
      orbsRef.current.forEach((orb, i) => {
        if (!orb) return
        gsap.set(orb, { opacity: 0, scale: 0 })
        
        // Staggered entrance
        gsap.to(orb, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 1.5 + i * 0.15,
          ease: 'back.out(2)',
        })

        // Floating animation - each orb moves in a unique path
        const duration = 4 + Math.random() * 3
        const xMove = (Math.random() - 0.5) * 40
        const yMove = (Math.random() - 0.5) * 30

        gsap.to(orb, {
          x: `+=${xMove}`,
          y: `+=${yMove}`,
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        })

        // Subtle rotation
        gsap.to(orb, {
          rotation: 360,
          duration: 20 + Math.random() * 10,
          repeat: -1,
          ease: 'none',
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
    >
      {/* Floating skill orbs */}
      {floatingSkills.map((skill, i) => {
        // Position orbs in a semi-circle around the hero
        const angle = (i / floatingSkills.length) * Math.PI * 2
        const radius = 35 // vw
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius * 0.6

        return (
          <div
            key={skill}
            ref={(el) => { orbsRef.current[i] = el }}
            className="pointer-events-none absolute hidden lg:block"
            style={{
              left: `calc(50% + ${x}vw)`,
              top: `calc(50% + ${y}vh)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="glass-card relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#3cd0bd] shadow-[0_0_20px_rgba(60,208,189,0.1)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3cd0bd] animate-pulse" />
              {skill}
            </div>
          </div>
        )
      })}

      <div className="text-center">
        <p
          ref={taglineRef}
          className="mb-4 text-sm font-medium tracking-[0.3em] text-[#3cd0bd] uppercase opacity-0"
        >
          Sydney, Australia
        </p>

        <h1
          ref={nameRef}
          className="font-display text-stroke mb-2 opacity-0"
          style={{
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          YASH GOYAL
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 text-lg font-light tracking-[0.2em] text-[#e2e8f0] opacity-0 md:text-xl"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          PRODUCTION ML ENGINEER & DATA SCIENTIST
        </p>

        <div ref={ctaRef} className="mt-12 flex justify-center gap-6 opacity-0">
          <button
            onClick={() => scrollToSection('about')}
            className="group relative overflow-hidden rounded-full border border-[#3cd0bd]/30 bg-transparent px-8 py-3 text-sm font-medium tracking-wider text-[#3cd0bd] transition-all duration-300 hover:border-[#3cd0bd] hover:shadow-[0_0_20px_rgba(60,208,189,0.3)]"
          >
            <span className="relative z-10">EXPLORE</span>
            <span className="absolute inset-0 z-0 scale-x-0 bg-[#3cd0bd]/10 transition-transform duration-300 group-hover:scale-x-100" />
          </button>
          <a
            href="mailto:yashgoyal1120@gmail.com"
            className="group relative overflow-hidden rounded-full bg-[#3cd0bd] px-8 py-3 text-sm font-medium tracking-wider text-[#030507] transition-all duration-300 hover:bg-[#00b894] hover:shadow-[0_0_30px_rgba(60,208,189,0.4)]"
          >
            <span className="relative z-10">GET IN TOUCH</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.2em] text-[#64748b]">SCROLL</span>
          <div className="h-12 w-px overflow-hidden bg-[#1c3f3a]">
            <div className="h-full w-full animate-scroll-line bg-[#3cd0bd]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
