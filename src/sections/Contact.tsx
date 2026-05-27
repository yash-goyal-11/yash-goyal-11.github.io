import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, linksRef.current], {
        opacity: 0,
        y: 40,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      }).to(
        linksRef.current,
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
  }, [])

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yashgoyal11',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: 'https://github.com/yash1120',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
    },
    {
      name: 'Scholar',
      // TODO: replace with your Google Scholar profile URL
      url: 'https://scholar.google.com/scholar?q=Yash+Goyal+iIL13Pred',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      url: 'mailto:yashgoyal1120@gmail.com',
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ]

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-32"
    >
      <div ref={contentRef} className="text-center">
        <h2
          ref={headingRef}
          className="font-display mb-8 text-5xl font-bold text-white md:text-7xl opacity-0"
        >
          Let's Build the
          <br />
          <span className="text-[#3cd0bd]">Future.</span>
        </h2>

        <p className="mx-auto mb-12 max-w-xl text-lg text-[#94a3b8]">
          I'm always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>

        <a
          href="mailto:yashgoyal1120@gmail.com"
          className="group relative mb-16 inline-block overflow-hidden rounded-full bg-[#3cd0bd] px-10 py-4 text-lg font-semibold text-[#030507] transition-all duration-300 hover:bg-[#00b894] hover:shadow-[0_0_40px_rgba(60,208,189,0.4)]"
        >
          <span className="relative z-10">Initiate Sequence</span>
          <span className="absolute inset-0 z-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
        </a>

        <div
          ref={linksRef}
          className="flex justify-center gap-6 opacity-0"
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[#e2e8f0] transition-all duration-300 hover:border-[#3cd0bd]/30 hover:bg-[#3cd0bd]/10 hover:text-[#3cd0bd]"
            >
              {link.icon}
              <span className="text-sm font-medium">{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-[#64748b]">
          &copy; {new Date().getFullYear()} Yash Goyal. Crafted with
          passion & precision.
        </p>
      </footer>
    </section>
  )
}
