import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TokenStreamAnimation, AgentThinkingAnimation, NeuralNetworkPulse } from '../components/LLMAnimation'

gsap.registerPlugin(ScrollTrigger)

type Command = {
  input: string
  output: string[]
  isError?: boolean
}

const AVAILABLE_COMMANDS: Record<string, Command> = {
  help: {
    input: 'help',
    output: [
      'Available commands:',
      '  skills     - List core technical skills',
      '  projects   - Show featured projects',
      '  experience - Display work history',
      '  education  - Show academic background',
      '  contact    - Get contact information',
      '  hire       - Initiate hiring sequence',
      '  clear      - Clear terminal',
    ],
  },
  skills: {
    input: 'skills',
    output: [
      '=== CORE TECHNICAL SKILLS ===',
      '',
      'AI / ML / GenAI:',
      '  ✓ LLMs, LangChain, LangGraph, Hugging Face',
      '  ✓ PyTorch, TensorFlow, XGBoost, LightGBM',
      '  ✓ Agentic AI, RAG, Computer Vision',
      '',
      'Cloud & MLOps:',
      '  ✓ Azure ML, AWS, GCP, Docker, Kubernetes',
      '  ✓ CI/CD, Terraform, MLflow, SAS Viya',
      '',
      'Data & Engineering:',
      '  ✓ Python, SQL, Neo4j, FastAPI, Flask',
      '  ✓ Pandas, NumPy, REST APIs, Git/GitHub',
      '',
      'Confidence Level: Production-ready across core domains',
    ],
  },
  projects: {
    input: 'projects',
    output: [
      '=== FEATURED PROJECTS ===',
      '',
      '1. Agentic MLOps Monitor',
      '   → Auto-detects data drift, LLM diagnostics, Azure ML',
      '',
      '2. Graph-QA Agent (LLM + Neo4j)',
      '   → Knowledge graph construction, entity extraction, Cypher',
      '',
      '3. Real-Time Traffic Analysis',
      '   → 95% detection accuracy, 30% latency reduction, AWS',
      '',
      '4. AI Heart Disease Prediction',
      '   → 90%+ accuracy, PCA/SMOTE, ensemble models',
    ],
  },
  experience: {
    input: 'experience',
    output: [
      '=== WORK EXPERIENCE ===',
      '',
      'Cloud & Tech Intern - SAS Institute',
      '  Jan 2026 - Present | Sydney, Australia',
      '  Winner: SAS Viya for Learners Challenge (ANZ) 2025',
      '',
      'ML Engineer - AirLabOne',
      '  Sep 2025 - Dec 2025 | Sydney, Australia',
      '  GPU-accelerated ML pipelines, NVIDIA Omniverse',
      '',
      'Teaching Tutor - University of Sydney',
      '  Aug 2025 - Present | OOP (INFO1113)',
      '',
      'Software Eng Intern - ITS Lab, IIT Madras',
      '  Oct 2023 - Feb 2024 | -25% latency, +30% engagement',
    ],
  },
  education: {
    input: 'education',
    output: [
      '=== EDUCATION ===',
      '',
      'Master of Computer Science (Data Science & AI)',
      '  The University of Sydney | 2024 - 2025',
      '',
      'B.Sc. Programming & Data Science (CGPA: 8.02)',
      '  Indian Institute of Technology Madras | 2020 - 2023',
      '',
      'B.Sc. Physical Science with CS (CGPA: 8.77)',
      '  Hansraj College, University of Delhi | 2020 - 2023',
    ],
  },
  contact: {
    input: 'contact',
    output: [
      '=== CONTACT INFORMATION ===',
      '',
      'Email:    yashgoyal1120@gmail.com',
      'Phone:    +61 402 412 386',
      'LinkedIn: linkedin.com/in/yashgoyal11',
      'Location: Sydney, Australia',
      '',
      'Ready to discuss your next project?',
      'Type "hire" to initiate the hiring sequence.',
    ],
  },
  hire: {
    input: 'hire',
    output: [
      '=== HIRING SEQUENCE INITIATED ===',
      '',
      '┏━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┓',
      '┃  SYSTEM: Candidate profile loaded              ┃',
      '┃  STATUS: Available for full-time roles         ┃',
      '┃  MATCH:  99.7% fit for ML/Data roles           ┃',
      '┣━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━┛',
      '',
      '✅ GPU-accelerated ML pipelines: VERIFIED',
      '✅ Production AI deployments: VERIFIED',
      '✅ Cross-functional collaboration: VERIFIED',
      '✅ Teaching & mentoring: VERIFIED',
      '✅ Hackathon winner mindset: VERIFIED',
      '',
      'DEPLOYING CANDIDATE TO YOUR TEAM...',
      '',
      '⚡ Click the button below to make it official! ⚡',
    ],
  },
}

const UNKNOWN_COMMAND: Command = {
  input: '',
  output: ['Command not found. Type "help" for available commands.'],
  isError: true,
}

export default function HireTerminal() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [history, setHistory] = useState<Command[]>([
    {
      input: '',
      output: [
        'Welcome to Yash Goyal\'s Interactive Terminal v2.0',
        'Type "help" to explore, or "hire" to make a decision.',
        '',
        'yash@portfolio:~$ _',
      ],
    },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [showHireModal, setShowHireModal] = useState(false)

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    let command: Command

    if (trimmed === 'clear') {
      setHistory([
        {
          input: 'clear',
          output: ['Terminal cleared.', 'yash@portfolio:~$ _'],
        },
      ])
      return
    }

    if (trimmed === 'hire') {
      setShowConfetti(true)
      setTimeout(() => setShowHireModal(true), 1500)
      command = AVAILABLE_COMMANDS.hire
    } else if (AVAILABLE_COMMANDS[trimmed]) {
      command = AVAILABLE_COMMANDS[trimmed]
    } else {
      command = { ...UNKNOWN_COMMAND, input: cmd }
    }

    setHistory((prev) => [...prev, command])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return
    executeCommand(currentInput)
    setCurrentInput('')
  }

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(terminalRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Confetti particles
  const confettiParticles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#3cd0bd', '#00b894', '#a29bfe', '#0984e3', '#ffffff'][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    duration: Math.random() * 2 + 2,
  }))

  return (
    <section
      id="terminal"
      ref={sectionRef}
      className="relative z-10 px-4 py-32 md:py-48"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display mb-4 text-center text-4xl font-bold text-white md:text-5xl">
          Try the <span className="text-[#3cd0bd]">Terminal</span>
        </h2>
        <p className="mb-12 text-center text-[#64748b]">
          Type commands to explore my skills, or just type{" "}
          <span className="rounded bg-[#1c3f3a]/50 px-2 py-0.5 font-mono text-[#3cd0bd]">
            hire
          </span>{" "}
          to see what happens.
        </p>

        {/* Terminal */}
        <div
          ref={terminalRef}
          className="relative overflow-hidden rounded-2xl border border-[#1c3f3a] bg-[#0d1419] shadow-[0_0_60px_rgba(28,63,58,0.2)]"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-[#1c3f3a]/50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-xs text-[#64748b] font-mono">
              yash@portfolio — zsh — 80x24
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={terminalBodyRef}
            className="terminal-content max-h-[60vh] overflow-y-auto p-4 font-mono text-sm transition-all duration-300"
            data-lenis-prevent
          >
            {history.map((cmd, i) => (
              <div key={i} className="mb-4">
                {cmd.input && (
                  <div className="flex gap-2 text-[#3cd0bd]">
                    <span>yash@portfolio:~$</span>
                    <span className={cmd.isError ? 'text-red-400' : 'text-white'}>
                      {cmd.input}
                    </span>
                  </div>
                )}
                {cmd.output.map((line, j) => (
                  <div
                    key={j}
                    className={`whitespace-pre ${
                      line.includes('===')
                        ? 'font-bold text-[#3cd0bd]'
                        : line.includes('✅')
                        ? 'text-green-400'
                        : line.includes('┃') || line.includes('┏') || line.includes('┓') || line.includes('┣') || line.includes('┛') || line.includes('━')
                        ? 'text-[#3cd0bd]'
                        : line.includes('⚡')
                        ? 'font-bold text-yellow-400'
                        : 'text-[#94a3b8]'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}

            {/* Current input line */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <span className="text-[#3cd0bd]">yash@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none font-mono"
                placeholder=""
                autoFocus
                spellCheck={false}
              />
            </form>
            <div className="h-4" />
          </div>

          {/* Blinking cursor overlay */}
          <div className="pointer-events-none absolute bottom-4 right-4 text-xs text-[#64748b]">
            Cursor blinking...
          </div>
        </div>

        {/* Quick command buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {['skills', 'projects', 'experience', 'hire'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className={`rounded-full border px-4 py-2 text-sm font-mono transition-all duration-300 ${
                cmd === 'hire'
                  ? 'border-[#3cd0bd] bg-[#3cd0bd]/10 text-[#3cd0bd] hover:bg-[#3cd0bd]/20'
                  : 'border-white/10 bg-white/5 text-[#94a3b8] hover:border-[#3cd0bd]/30 hover:text-[#3cd0bd]'
              }`}
            >
              {cmd === 'hire' ? '⚡ hire' : `$ ${cmd}`}
            </button>
          ))}
        </div>

        {/* LLM Animation Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <TokenStreamAnimation />
          </div>
          <AgentThinkingAnimation />
          <NeuralNetworkPulse />
        </div>
      </div>

      {/* Confetti overlay */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-[100]">
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: '-20px',
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `confetti-fall ${p.duration}s ${p.delay}s ease-out forwards`,
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Hire modal */}
      {showHireModal && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative mx-4 max-w-lg rounded-3xl border border-[#3cd0bd]/30 bg-[#030507] p-8 text-center shadow-[0_0_80px_rgba(60,208,189,0.2)]">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3cd0bd]/10 text-4xl">
                🎉
              </div>
            </div>
            <h3 className="font-display mb-2 text-2xl font-bold text-white">
              Excellent Decision!
            </h3>
            <p className="mb-6 text-[#94a3b8]">
              You've just taken the first step toward building something incredible together.
            </p>
            <div className="mb-6 space-y-2 text-sm text-[#e2e8f0]">
              <div className="rounded-lg bg-[#1c3f3a]/30 p-3">
                <span className="text-[#3cd0bd]">Email:</span>{' '}
                yashgoyal1120@gmail.com
              </div>
              <div className="rounded-lg bg-[#1c3f3a]/30 p-3">
                <span className="text-[#3cd0bd]">Phone:</span>{' '}
                +61 402 412 386
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:yashgoyal1120@gmail.com"
                className="rounded-full bg-[#3cd0bd] px-6 py-3 font-semibold text-[#030507] transition-all hover:bg-[#00b894]"
              >
                Send Email
              </a>
              <button
                onClick={() => {
                  setShowHireModal(false)
                  setShowConfetti(false)
                }}
                className="rounded-full border border-white/20 px-6 py-3 text-white transition-all hover:border-white/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
