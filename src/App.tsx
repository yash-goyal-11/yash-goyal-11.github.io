import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import SkillConstellation from './sections/SkillConstellation'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Publications from './sections/Publications'
import HireTerminal from './sections/HireTerminal'
import Contact from './sections/Contact'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf as any)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <ParticleBackground />
      <Navigation />

      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <SkillConstellation />
        <Experience />
        <Projects />
        <Publications />
        <HireTerminal />
        <Contact />
      </main>
    </>
  )
}
