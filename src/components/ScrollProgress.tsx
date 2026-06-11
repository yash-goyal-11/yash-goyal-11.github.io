import { useEffect, useRef } from 'react'

/** Thin gradient progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[#3cd0bd] via-[#00b894] to-[#3cd0bd] shadow-[0_0_8px_rgba(60,208,189,0.6)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
