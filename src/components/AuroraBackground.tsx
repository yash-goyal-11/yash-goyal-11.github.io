import { useReducedMotion } from '../hooks/use-reduced-motion'

/**
 * Calm, premium aurora mesh — replaces the old 4k-particle canvas.
 * Pure CSS: a few heavily-blurred gradient blobs drifting slowly,
 * plus a faint fixed dot-grid for "engineered" texture. Cheap on the GPU
 * and far more legible behind text than the particle field was.
 */
export default function AuroraBackground() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Faint engineering dot-grid */}
      <div className="aurora-dots absolute inset-0" />

      {/* Drifting aurora blobs */}
      <div
        className="aurora-blob absolute -left-[10%] -top-[10%] h-[55vw] w-[55vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(60,208,189,0.18), transparent 60%)',
          animation: reducedMotion ? 'none' : 'aurora-drift-1 26s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob absolute right-[-15%] top-[10%] h-[50vw] w-[50vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,184,148,0.16), transparent 60%)',
          animation: reducedMotion ? 'none' : 'aurora-drift-2 32s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob absolute bottom-[-20%] left-[20%] h-[45vw] w-[45vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(40,90,140,0.14), transparent 60%)',
          animation: reducedMotion ? 'none' : 'aurora-drift-3 38s ease-in-out infinite',
        }}
      />

      {/* Vignette so edges stay deep and text pops */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(3,5,7,0.6)_100%)]" />
    </div>
  )
}
