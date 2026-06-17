import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import SectionLabel from '../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

interface ExperienceItem {
  role: string
  company: string
  location: string
  period: string
  highlights: string[]
}

const experiences: ExperienceItem[] = [
  {
    role: 'Cloud & Technology Intern',
    company: 'SAS Institute',
    location: 'Sydney, Australia',
    period: 'Jan 2026 - Present',
    highlights: [
      'Built real-time analytics workflows on SAS Viya for end-to-end ML ops',
      'Improved deployment reliability with internal tooling and automation',
      'Winner: SAS Viya for Learners Challenge (ANZ) 2025',
    ],
  },
  {
    role: 'Machine Learning Engineer',
    company: 'AirLabOne',
    location: 'Sydney, Australia',
    period: 'Sep 2025 - Dec 2025',
    highlights: [
      'Designed GPU-accelerated ML pipelines integrated with NVIDIA Omniverse',
      'Built real-time insight extraction systems with high reliability',
      'Applied CI/CD and GitHub workflows to streamline releases',
    ],
  },
  {
    role: 'Teaching Tutor - OOP (INFO1113)',
    company: 'University of Sydney',
    location: 'Sydney, Australia',
    period: 'Aug 2025 - Present',
    highlights: [
      'Deliver tutorials on Java and OOP design patterns',
      'Design practice problems and code-review frameworks',
      'Provide targeted feedback to improve student outcomes',
    ],
  },
  {
    role: 'Software Engineering Intern',
    company: 'ITS Lab, IIT Madras',
    location: 'Chennai, India',
    period: 'Oct 2023 - Feb 2024',
    highlights: [
      'Built Python/Flask backend for real-time traffic video analytics',
      'Reduced processing latency by ~25% through pipeline optimization',
      'Shipped full-stack solution with live metrics dashboard',
    ],
  },
]

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollProgress = useRef(0)
  const velocity = useRef(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number | null = null
    let isVisible = true
    let stars: { x: number; y: number; z: number; prevZ: number }[] = []
    const numStars = 800

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const initStars = () => {
      stars = []
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.offsetWidth - canvas.offsetWidth / 2,
          y: Math.random() * canvas.offsetHeight - canvas.offsetHeight / 2,
          z: Math.random() * 1000,
          prevZ: 0,
        })
      }
    }

    resize()
    initStars()

    const handleScroll = () => {
      const newVelocity = Math.abs(window.scrollY - (window as any)._lastScrollY || 0)
      velocity.current = Math.min(newVelocity * 0.5, 50)
      ;(window as any)._lastScrollY = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    const draw = () => {
      if (!isVisible) {
        animationId = null
        return
      }
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const cx = w / 2
      const cy = h / 2

      ctx.fillStyle = '#030507'
      ctx.fillRect(0, 0, w, h)

      // Velocity decay
      velocity.current *= 0.95

      // Rotation based on scroll
      const rotation = scrollProgress.current * Math.PI * 0.5

      stars.forEach((star) => {
        star.prevZ = star.z
        star.z -= 2 + velocity.current * 0.1

        if (star.z <= 0) {
          star.z = 1000
          star.prevZ = 1000
          star.x = Math.random() * w - cx
          star.y = Math.random() * h - cy
        }

        const cos = Math.cos(rotation * 0.02)
        const sin = Math.sin(rotation * 0.02)
        const rx = star.x * cos - star.y * sin
        const ry = star.x * sin + star.y * cos

        const sx = (rx / star.z) * 400 + cx
        const sy = (ry / star.z) * 400 + cy

        if (sx < 0 || sx > w || sy < 0 || sy > h) return

        const size = Math.max(0.5, (1 - star.z / 1000) * 2.5)
        const alpha = Math.max(0.1, 1 - star.z / 1000)

        // Warp effect - stretch stars when scrolling fast
        const prevSx = (rx / star.prevZ) * 400 + cx
        const prevSy = (ry / star.prevZ) * 400 + cy

        ctx.beginPath()
        ctx.strokeStyle = `rgba(60, 208, 189, ${alpha * 0.6})`
        ctx.lineWidth = size
        ctx.moveTo(prevSx, prevSy)
        ctx.lineTo(sx, sy)
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Center glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.4)
      gradient.addColorStop(0, 'rgba(28, 63, 58, 0.15)')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      resize()
      initStars()
    }
    window.addEventListener('resize', handleResize)

    // ScrollTrigger for progress
    const st = ScrollTrigger.create({
      trigger: canvas,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    // Pause rAF loop when canvas is off-screen
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const wasVisible = isVisible
          isVisible = entry.isIntersecting
          if (isVisible && !wasVisible && animationId === null) {
            draw()
          }
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      st.kill()
      io.disconnect()
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(28,63,58,0.25),transparent_70%)]"
        style={{ zIndex: 0, backgroundColor: '#030507' }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return

        gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -60 : 60 })

        gsap.to(item, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative z-10 py-32 md:py-48"
    >
      <Starfield />

      <div className="relative z-10 mx-auto max-w-5xl px-4">
        <SectionLabel>Experience</SectionLabel>
        <h2 className="font-display mb-16 text-center text-4xl font-bold text-white md:text-5xl">
          Work <span className="text-[#3cd0bd]">Experience</span>
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[#3cd0bd] via-[#1c3f3a] to-transparent md:left-1/2 md:-translate-x-px" />

          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={(el) => { itemsRef.current[index] = el }}
              className={`relative mb-12 pl-12 md:pl-0 ${
                index % 2 === 0 ? 'md:pr-[52%] md:text-right' : 'md:pl-[52%]'
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-2 top-2 h-5 w-5 rounded-full border-2 border-[#3cd0bd] bg-[#030507] shadow-[0_0_10px_rgba(60,208,189,0.5)] md:left-1/2 md:-translate-x-1/2`}
              />

              <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-[#3cd0bd]/30">
                <div className="mb-1 text-sm font-medium text-[#3cd0bd]">
                  {exp.period}
                </div>
                <h3 className="font-display text-xl font-semibold text-white">
                  {exp.role}
                </h3>
                <div className="mb-3 text-sm text-[#94a3b8]">
                  {exp.company} | {exp.location}
                </div>
                <ul className="space-y-1">
                  {exp.highlights.map((highlight, hIndex) => (
                    <li
                      key={hIndex}
                      className="flex items-start gap-2 text-sm text-[#94a3b8]"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#3cd0bd]" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
