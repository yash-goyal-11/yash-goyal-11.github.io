import { useCallback, useEffect, useState } from 'react'
import { Command } from 'cmdk'
import {
  User,
  Cpu,
  Network,
  Briefcase,
  FolderGit2,
  BookOpen,
  Terminal,
  Mail,
  FileDown,
  Github,
  Linkedin,
  GraduationCap,
  Copy,
  ArrowUp,
  Search,
} from 'lucide-react'

const EMAIL = 'yashgoyal1120@gmail.com'

interface PaletteAction {
  id: string
  label: string
  hint?: string
  icon: React.ReactNode
  run: () => void
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)

    window.addEventListener('keydown', onKey)
    window.addEventListener('open-cmdk', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-cmdk', onOpen)
    }
  }, [])

  const close = useCallback(() => setOpen(false), [])

  const goTo = useCallback(
    (id: string) => {
      close()
      // Let the dialog unmount before scrolling so Lenis doesn't fight it
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
    },
    [close]
  )

  const sections: PaletteAction[] = [
    { id: 'about', label: 'About', icon: <User />, run: () => goTo('about') },
    { id: 'skills', label: 'Skills', icon: <Cpu />, run: () => goTo('skills') },
    { id: 'constellation', label: 'Knowledge Graph', icon: <Network />, run: () => goTo('constellation') },
    { id: 'experience', label: 'Experience', icon: <Briefcase />, run: () => goTo('experience') },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 />, run: () => goTo('projects') },
    { id: 'publications', label: 'Research & Publications', icon: <BookOpen />, run: () => goTo('publications') },
    { id: 'terminal', label: 'Hire Terminal', icon: <Terminal />, run: () => goTo('terminal') },
    { id: 'contact', label: 'Contact', icon: <Mail />, run: () => goTo('contact') },
  ]

  const actions: PaletteAction[] = [
    {
      id: 'resume',
      label: 'Download Resume',
      hint: 'PDF',
      icon: <FileDown />,
      run: () => {
        close()
        window.open('/resume.pdf', '_blank', 'noopener,noreferrer')
      },
    },
    {
      id: 'copy-email',
      label: copied ? 'Email copied ✓' : 'Copy Email Address',
      icon: <Copy />,
      run: () => {
        navigator.clipboard?.writeText(EMAIL).then(() => {
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
            close()
          }, 900)
        })
      },
    },
    {
      id: 'email',
      label: 'Send an Email',
      hint: EMAIL,
      icon: <Mail />,
      run: () => {
        close()
        window.location.href = `mailto:${EMAIL}`
      },
    },
    {
      id: 'top',
      label: 'Back to Top',
      icon: <ArrowUp />,
      run: () => {
        close()
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
      },
    },
  ]

  const links: PaletteAction[] = [
    {
      id: 'github',
      label: 'GitHub',
      hint: 'yash1120',
      icon: <Github />,
      run: () => {
        close()
        window.open('https://github.com/yash1120', '_blank', 'noopener,noreferrer')
      },
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      hint: 'yashgoyal11',
      icon: <Linkedin />,
      run: () => {
        close()
        window.open('https://linkedin.com/in/yashgoyal11', '_blank', 'noopener,noreferrer')
      },
    },
    {
      id: 'scholar',
      label: 'Google Scholar',
      icon: <GraduationCap />,
      run: () => {
        close()
        window.open('https://scholar.google.com/scholar?q=Yash+Goyal+iIL13Pred', '_blank', 'noopener,noreferrer')
      },
    },
  ]

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#030507]/70 backdrop-blur-sm"
        onClick={close}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#3cd0bd]/20 bg-[#0a1118]/95 shadow-[0_0_60px_rgba(60,208,189,0.15),0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Top scanline accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3cd0bd]/60 to-transparent" />

        <Command label="Command palette" loop>
          <div className="flex items-center gap-3 border-b border-white/5 px-4">
            <Search className="h-4 w-4 shrink-0 text-[#3cd0bd]" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search…"
              className="h-14 w-full bg-transparent text-sm text-[#e2e8f0] outline-none placeholder:text-[#8b98ad]"
            />
            <kbd className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] tracking-wider text-[#8b98ad]">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[320px] overflow-y-auto p-2" data-lenis-prevent>
            <Command.Empty className="py-8 text-center text-sm text-[#8b98ad]">
              No results. Try “projects” or “resume”.
            </Command.Empty>

            <Command.Group
              heading="Navigate"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[#3cd0bd]/70"
            >
              {sections.map((item) => (
                <PaletteRow key={item.id} item={item} />
              ))}
            </Command.Group>

            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[#3cd0bd]/70"
            >
              {actions.map((item) => (
                <PaletteRow key={item.id} item={item} />
              ))}
            </Command.Group>

            <Command.Group
              heading="Links"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[#3cd0bd]/70"
            >
              {links.map((item) => (
                <PaletteRow key={item.id} item={item} />
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5 text-[10px] tracking-wider text-[#8b98ad]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3cd0bd]" />
              YASH.OS v2.0
            </span>
            <span>↑↓ navigate · ↵ select</span>
          </div>
        </Command>
      </div>
    </div>
  )
}

function PaletteRow({ item }: { item: PaletteAction }) {
  return (
    <Command.Item
      value={item.label}
      onSelect={item.run}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#94a3b8] transition-colors data-[selected=true]:bg-[#3cd0bd]/10 data-[selected=true]:text-[#e2e8f0] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-[#8b98ad] data-[selected=true]:[&_svg]:text-[#3cd0bd]"
    >
      {item.icon}
      <span>{item.label}</span>
      {item.hint && (
        <span className="ml-auto text-[10px] text-[#475569]">{item.hint}</span>
      )}
    </Command.Item>
  )
}
