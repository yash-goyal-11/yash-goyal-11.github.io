import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import ScrambleText from '../components/ScrambleText'

const floatingSkills = [
  'Python', 'LangChain', 'LangGraph', 'Azure ML', 'AWS',
  'Docker', 'Kubernetes', 'MLflow', 'Neo4j',
]

const roles = [
  'LLM-Powered Agents',
  'Knowledge-Graph QA Systems',
  'GPU-Accelerated ML Pipelines',
  'Production MLOps Platforms',
]

function RoleRotator({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState(reducedMotion ? roles[0] : '')

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(roles[0])
      return
    }

    let timeout: ReturnType<typeof setTimeout>
    let char = 0
    let deleting = false

    const step = () => {
      const word = roles[index]

      if (!deleting) {
        char++
        setDisplay(word.slice(0, char))
        if (char === word.length) {
          deleting = true
          timeout = setTimeout(step, 2200) // hold the full word
          return
        }
        timeout = setTimeout(step, 50)
      } else {
        char--
        setDisplay(word.slice(0, char))
        if (char === 0) {
          setIndex((i) => (i + 1) % roles.length)
          return
        }
        timeout = setTimeout(step, 25)
      }
    }

    timeout = setTimeout(step, 300)
    return () => clearTimeout(timeout)
  }, [index, reducedMotion])

  return (
    <span className="text-[#3cd0bd]">
      {display}
      {!reducedMotion && (
        <span className="ml-0.5 inline-block w-[2px] animate-caret-blink bg-[#3cd0bd]">
          &nbsp;
        </span>
      )}
    </span>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const rolesRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      gsap.set(
        [subtitleRef.current, rolesRef.current, taglineRef.current, ctaRef.current],
        { opacity: 1, y: 0 }
      )
      orbsRef.current.forEach((orb) => {
        if (orb) gsap.set(orb, { opacity: 1, scale: 1 })
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set([subtitleRef.current, rolesRef.current, taglineRef.current], {
        opacity: 0,
        y: 60,
      })
      gsap.set(ctaRef.current, { opacity: 0, y: 30 })

      const tl = gsap.timeline({ delay: 0.1 })

      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
        .to(
          subtitleRef.current,
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.6'
        )
        .to(
          rolesRef.current,
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.6'
        )
        .to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )

      // Floating orbs animation
      orbsRef.current.forEach((orb, i) => {
        if (!orb) return
        gsap.set(orb, { opacity: 0, scale: 0 })

        gsap.to(orb, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 1.5 + i * 0.15,
          ease: 'back.out(2)',
        })

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
      className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Perspective grid floor */}
      <div className="grid-floor pointer-events-none absolute inset-x-0 bottom-0 h-[45vh]" />

      {/* Floating skill orbs */}
      {floatingSkills.map((skill, i) => {
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
        <div
          ref={taglineRef}
          className="mb-6 flex flex-col items-center gap-3 opacity-0"
        >
          {/* Availability badge — the first thing a recruiter scans for */}
          <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wider text-[#e2e8f0]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b894] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00b894]" />
            </span>
            OPEN TO ML / MLOPS ROLES
          </span>
          <p className="text-sm font-medium tracking-[0.3em] text-[#3cd0bd] uppercase">
            Sydney, Australia
          </p>
        </div>

        <ScrambleText
          as="h1"
          text="YASH GOYAL"
          delay={300}
          speed={90}
          className="font-display text-stroke glow-teal mb-2 whitespace-nowrap"
          style={{
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        />

        <p
          ref={subtitleRef}
          className="mt-6 text-lg font-light tracking-[0.2em] text-[#e2e8f0] opacity-0 md:text-xl"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          PRODUCTION ML ENGINEER &amp; DATA SCIENTIST
        </p>

        <p
          ref={rolesRef}
          className="mt-4 h-7 font-mono text-sm tracking-wider text-[#94a3b8] opacity-0 md:text-base"
        >
          <span className="text-[#64748b]">I build </span>
          <RoleRotator reducedMotion={reducedMotion} />
        </p>

        <div ref={ctaRef} className="mt-12 flex flex-wrap justify-center gap-4 opacity-0 sm:gap-6">
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
          <button
            onClick={() => window.dispatchEvent(new Event('open-cmdk'))}
            className="group hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-[#94a3b8] transition-all duration-300 hover:border-[#3cd0bd]/40 hover:text-[#e2e8f0] md:inline-flex"
            aria-label="Open command palette"
          >
            <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#3cd0bd]">
              ⌘K
            </kbd>
            COMMAND
          </button>
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
