import { useEffect, useRef, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import ScrollProgress from './components/ScrollProgress'
import CommandPalette from './components/CommandPalette'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import SkillConstellation from './sections/SkillConstellation'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Publications from './sections/Publications'
import HireTerminal from './sections/HireTerminal'
import Contact from './sections/Contact'
import { useReducedMotion } from './hooks/use-reduced-motion'

const AuroraBackground = lazy(() => import('./components/AuroraBackground'))

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })

    if (reducedMotion) return

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf as any)
    }
  }, [reducedMotion])

  return (
    <>
      {!reducedMotion && <CustomCursor />}
      <Suspense fallback={null}>
        <AuroraBackground />
      </Suspense>
      <div className="noise-overlay" aria-hidden="true" />
      <ScrollProgress />
      <CommandPalette />
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
