interface SectionLabelProps {
  /** The short label, e.g. "ABOUT" */
  children: string
  /** Center the label + brackets (default). Set false for left-aligned sections. */
  centered?: boolean
}

/**
 * Mono "// LABEL" eyebrow with bracket accents — echoes the Hero HUD
 * typography so every section reads as part of the same system.
 */
export default function SectionLabel({ children, centered = true }: SectionLabelProps) {
  return (
    <div
      className={`mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#3cd0bd]/70 ${
        centered ? 'justify-center' : 'justify-start'
      }`}
    >
      <span className="h-px w-6 bg-[#3cd0bd]/40" />
      <span>// {children}</span>
      <span className="h-px w-6 bg-[#3cd0bd]/40" />
    </div>
  )
}
