import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Graph', href: '#constellation' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Research', href: '#publications' },
  { label: 'Terminal', href: '#terminal' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        }
      },
      // A section is "active" when it occupies the middle band of the viewport
      { rootMargin: '-40% 0px -50% 0px' }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.4,
        ease: 'power3.out',
      })
    }
  }, [isVisible])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 opacity-0"
      style={{ transform: 'translateY(-100px)' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#030507]/80 px-6 py-3 backdrop-blur-xl">
          <a
            href="#"
            className="font-display text-lg font-bold text-white"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            YG<span className="text-[#3cd0bd]">.</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                  activeSection === link.href
                    ? 'bg-[#3cd0bd]/10 text-[#3cd0bd]'
                    : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => window.dispatchEvent(new Event('open-cmdk'))}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#94a3b8] transition-all duration-300 hover:border-[#3cd0bd]/40 hover:text-white"
              aria-label="Open command palette"
              title="Command palette (Ctrl+K)"
            >
              <kbd className="font-mono text-[10px] text-[#3cd0bd]">⌘K</kbd>
            </button>
            {/* Drop resume.pdf in app/public/ to enable this link */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-[#3cd0bd]/40 bg-[#3cd0bd]/10 px-4 py-2 text-sm font-medium text-[#3cd0bd] transition-all duration-300 hover:border-[#3cd0bd] hover:bg-[#3cd0bd]/20"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
              Resume
            </a>
          </div>

          <button
            className="flex flex-col gap-1.5 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`h-px w-6 bg-white transition-all duration-300 ${
                isOpen ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px bg-white transition-all duration-300 ${
                isOpen ? 'w-0 opacity-0' : 'w-6 opacity-100'
              }`}
            />
            <span
              className={`h-px w-6 bg-white transition-all duration-300 ${
                isOpen ? '-translate-y-[3.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        <div
          className={`mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#030507]/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col p-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="rounded-lg px-4 py-3 text-sm text-[#94a3b8] transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-lg border border-[#3cd0bd]/40 bg-[#3cd0bd]/10 px-4 py-3 text-sm font-medium text-[#3cd0bd] transition-colors hover:bg-[#3cd0bd]/20"
            >
              Resume ↓
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
