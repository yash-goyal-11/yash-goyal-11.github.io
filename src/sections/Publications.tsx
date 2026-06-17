import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLabel from '../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

interface Publication {
  title: string
  journal: string
  description: string
  result: string
  doi?: string
}

interface Award {
  title: string
  year: string
  description: string
}

const publications: Publication[] = [
  {
    title: 'Antiprotozoal Peptide Prediction using ML algorithms and feature selection',
    journal: 'Heliyon',
    description: 'Co-authored ML study on antiprotozoal peptide prediction and feature selection.',
    result: 'Achieved significant reduction in false-positive rates.',
    doi: 'https://doi.org/10.1016/j.heliyon.2024.e36163',
  },
  {
    title: 'iIL13Pred: Improved Prediction of IL-13 Inducing Peptides',
    journal: 'BMC Bioinformatics',
    description: 'Improved peptide prediction model with stronger generalization.',
    result: '15% improvement in prediction accuracy over prior methods.',
    doi: 'https://doi.org/10.1186/s12859-023-05248-6',
  },
]

const awards: Award[] = [
  {
    title: 'SAS Viya for Learners Challenge (ANZ)',
    year: '2025',
    description: 'Winner - Top placement in regional analytics/ML challenge.',
  },
  {
    title: 'Smart India Hackathon (SIH)',
    year: '2023',
    description: 'Winner - National-level hackathon champion.',
  },
  {
    title: 'HackLife 2023 (Devpost)',
    year: '2023',
    description: 'Winner - Best project in international hackathon.',
  },
  {
    title: 'Hackathon Mentor',
    year: '2025',
    description:
      'Humanitarian Innovation Hackathon, USYD - Mentored teams that placed 1st and 2nd.',
  },
]

export default function Publications() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pubRefs = useRef<(HTMLDivElement | null)[]>([])
  const awardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Publications animations
      pubRefs.current.forEach((pub, i) => {
        if (!pub) return
        gsap.set(pub, { opacity: 0, y: 40 })
        gsap.to(pub, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pub,
            start: 'top 85%',
          },
        })
      })

      // Awards animations
      awardRefs.current.forEach((award, i) => {
        if (!award) return
        gsap.set(award, { opacity: 0, x: -30 })
        gsap.to(award, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: award,
            start: 'top 85%',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="publications"
      ref={sectionRef}
      className="relative z-10 px-4 py-32 md:py-48"
    >
      <div className="mx-auto max-w-6xl">
        {/* Publications */}
        <div className="mb-24">
          <SectionLabel>Research</SectionLabel>
          <h2 className="font-display mb-12 text-center text-4xl font-bold text-white md:text-5xl">
            <span className="text-[#3cd0bd]">Research</span> & Publications
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {publications.map((pub, index) => (
              <div
                key={index}
                ref={(el) => { pubRefs.current[index] = el }}
                className="glass-card group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:border-[#3cd0bd]/30"
              >
                {/* Decorative line */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#3cd0bd] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 inline-block rounded-full bg-[#1c3f3a]/50 px-4 py-1 text-xs font-medium text-[#3cd0bd]">
                  {pub.journal}
                </div>

                <h3 className="mb-3 text-lg font-semibold text-white">
                  {pub.title}
                </h3>

                <p className="mb-4 text-sm text-[#94a3b8]">{pub.description}</p>

                <div className="flex items-center gap-2 text-sm text-[#3cd0bd]">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {pub.result}
                </div>

                {pub.doi && (
                  <div className="mt-5">
                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#e2e8f0] backdrop-blur-sm transition-all duration-300 hover:border-[#3cd0bd]/40 hover:bg-[#3cd0bd]/10 hover:text-[#3cd0bd]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Read paper
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div>
          <h2 className="font-display mb-12 text-center text-4xl font-bold text-white md:text-5xl">
            Awards & <span className="text-[#3cd0bd]">Recognition</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((award, index) => (
              <div
                key={index}
                ref={(el) => { awardRefs.current[index] = el }}
                className="glass-card group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 hover:border-[#3cd0bd]/30 hover:shadow-[0_0_20px_rgba(60,208,189,0.1)]"
              >
                {/* Trophy icon */}
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c3f3a]/50 text-[#3cd0bd] transition-all duration-300 group-hover:bg-[#3cd0bd]/20">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="font-display text-2xl font-bold text-[#3cd0bd]">
                  {award.year}
                </div>

                <h3 className="mt-2 text-sm font-semibold text-white">
                  {award.title}
                </h3>

                <p className="mt-2 text-xs text-[#8b98ad]">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
