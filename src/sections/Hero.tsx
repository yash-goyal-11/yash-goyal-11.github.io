import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import ScrambleText from '../components/ScrambleText'

const roles = [
  'LLM-powered agents',
  'knowledge-graph QA systems',
  'GPU-accelerated ML pipelines',
  'production MLOps platforms',
]

/* ── Live Sydney clock (HH:MM:SS) ───────────────────────────── */
function useSydneyTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-AU', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'Australia/Sydney',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ── Terminal-style role rotator ────────────────────────────── */
function RoleRotator({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState(reducedMotion ? roles[0] : '')

  useEffect(() => {
    if (reducedMotion) { setDisplay(roles[0]); return }
    let timeout: ReturnType<typeof setTimeout>
    let char = 0
    let deleting = false
    const step = () => {
      const word = roles[index]
      if (!deleting) {
        char++
        setDisplay(word.slice(0, char))
        if (char === word.length) { deleting = true; timeout = setTimeout(step, 2200); return }
        timeout = setTimeout(step, 50)
      } else {
        char--
        setDisplay(word.slice(0, char))
        if (char === 0) { setIndex((i) => (i + 1) % roles.length); return }
        timeout = setTimeout(step, 25)
      }
    }
    timeout = setTimeout(step, 400)
    return () => clearTimeout(timeout)
  }, [index, reducedMotion])

  return (
    <span className="text-[#3cd0bd]">
      {display}
      {!reducedMotion && (
        <span className="ml-px inline-block w-[8px] animate-caret-blink bg-[#3cd0bd] align-middle" style={{ height: '1em' }}>&nbsp;</span>
      )}
    </span>
  )
}

/* ── HUD status panel (the right-hand readout) ──────────────── */
function StatusPanel({ time }: { time: string }) {
  const rows = [
    { k: 'LOCATION', v: 'Sydney, AU' },
    { k: 'COORD', v: '33.87°S 151.21°E' },
    { k: 'LOCAL', v: time || '—' },
    { k: 'FOCUS', v: 'LLM Agents · MLOps' },
    { k: 'EXP', v: '4+ years' },
  ]
  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-6 font-mono text-sm">
      {/* scanline accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3cd0bd]/60 to-transparent" />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] tracking-[0.25em] text-[#3cd0bd]/80">// SYSTEM STATUS</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#00b894]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b894] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00b894]" />
          </span>
          ONLINE
        </span>
      </div>

      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between gap-4">
            <span className="text-[11px] tracking-wider text-[#8b98ad]">{r.k}</span>
            <span className="flex-1 mx-2 border-b border-dashed border-white/10" />
            <span className="text-[#e2e8f0]">{r.v}</span>
          </div>
        ))}
      </div>

      {/* availability + equalizer */}
      <div className="mt-5 flex items-center justify-between rounded-lg border border-[#3cd0bd]/20 bg-[#3cd0bd]/5 px-3 py-2.5">
        <span className="text-[11px] tracking-wider text-[#3cd0bd]">AVAILABLE FOR HIRE</span>
        <div className="flex items-end gap-[3px]" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[3px] origin-bottom rounded-sm bg-[#3cd0bd]"
              style={{
                height: '14px',
                animation: `hud-bar ${0.8 + i * 0.18}s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const time = useSydneyTime()

  useEffect(() => {
    const els = [leftRef.current, panelRef.current]
    if (reducedMotion) {
      gsap.set(els, { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.set(leftRef.current, { opacity: 0, y: 40 })
      gsap.set(panelRef.current, { opacity: 0, x: 40 })
      const tl = gsap.timeline({ delay: 0.15 })
      tl.to(leftRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .to(panelRef.current, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.7')
    }, containerRef)
    return () => ctx.revert()
  }, [reducedMotion])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative z-10 flex min-h-screen w-full items-center overflow-hidden px-6 lg:px-12"
    >
      {/* Perspective grid floor */}
      <div className="grid-floor pointer-events-none absolute inset-x-0 bottom-0 h-[40vh]" />

      {/* HUD corner brackets */}
      <span className="hud-corner left-5 top-20 border-l-2 border-t-2" />
      <span className="hud-corner right-5 top-20 border-r-2 border-t-2" />
      <span className="hud-corner bottom-5 left-5 border-b-2 border-l-2" />
      <span className="hud-corner bottom-5 right-5 border-b-2 border-r-2" />

      {/* Top status strip */}
      <div className="pointer-events-none absolute inset-x-0 top-8 z-10 mx-auto flex max-w-7xl items-center justify-between px-2 font-mono text-[11px] tracking-[0.2em] text-[#8b98ad]">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3cd0bd]" />
          PORTFOLIO.SYS
        </span>
        <span className="hidden sm:block">{time && `SYD ${time} AEST`}</span>
      </div>

      {/* Main content */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left column */}
        <div ref={leftRef} className="opacity-0 lg:col-span-7">
          <span className="glass-card mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wider text-[#e2e8f0]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00b894] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00b894]" />
            </span>
            OPEN TO ML / MLOPS ROLES
          </span>

          <p className="mb-3 font-mono text-sm tracking-[0.3em] text-[#3cd0bd] uppercase">
            Production ML Engineer
          </p>

          <ScrambleText
            as="h1"
            text="YASH GOYAL"
            delay={350}
            speed={85}
            className="gradient-text font-display block font-bold"
            style={{
              fontSize: 'clamp(3.25rem, 9vw, 8rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              filter: 'drop-shadow(0 0 36px rgba(60,208,189,0.28))',
            }}
          />

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#94a3b8] md:text-lg">
            I design and ship production-grade AI systems end to end — from
            intelligent agents to ML platforms that scale in live environments.
          </p>

          <p className="mt-5 font-mono text-sm text-[#8b98ad] md:text-base">
            <span className="text-[#3cd0bd]">$</span> builds{' '}
            <RoleRotator reducedMotion={reducedMotion} />
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo('projects')}
              className="group relative overflow-hidden rounded-full bg-[#3cd0bd] px-7 py-3 text-sm font-semibold tracking-wide text-[#030507] transition-all duration-300 hover:bg-[#00b894] hover:shadow-[0_0_30px_rgba(60,208,189,0.45)]"
            >
              <span className="relative z-10">View Work →</span>
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#3cd0bd]/30 px-7 py-3 text-sm font-medium tracking-wide text-[#3cd0bd] transition-all duration-300 hover:border-[#3cd0bd] hover:shadow-[0_0_20px_rgba(60,208,189,0.3)]"
            >
              Resume ↓
            </a>
            <button
              onClick={() => window.dispatchEvent(new Event('open-cmdk'))}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-[#94a3b8] transition-all duration-300 hover:border-[#3cd0bd]/40 hover:text-[#e2e8f0] md:inline-flex"
              aria-label="Open command palette"
            >
              <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#3cd0bd]">⌘K</kbd>
              Navigate
            </button>
          </div>
        </div>

        {/* Right column: HUD status panel */}
        <div ref={panelRef} className="opacity-0 lg:col-span-5">
          <StatusPanel time={time} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#8b98ad]">SCROLL</span>
          <div className="h-10 w-px overflow-hidden bg-[#1c3f3a]">
            <div className="h-full w-full animate-scroll-line bg-[#3cd0bd]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line { animation: scroll-line 2s ease-in-out infinite; }
      `}</style>
    </section>
  )
}
