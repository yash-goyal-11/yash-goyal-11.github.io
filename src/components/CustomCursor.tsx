import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const isHovering = useRef(false)

  useEffect(() => {
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    const handleMouseEnter = () => {
      isHovering.current = true
    }

    const handleMouseLeave = () => {
      isHovering.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Add listeners for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-magnetic]')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    let rafId: number

    const animate = () => {
      // Dot follows instantly
      pos.current.x = target.current.x
      pos.current.y = target.current.y

      // Ring follows with lerp
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.15
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 2}px, ${pos.current.y - 2}px)`
      }

      if (ringRef.current) {
        const size = isHovering.current ? 60 : 40
        ringRef.current.style.width = `${size}px`
        ringRef.current.style.height = `${size}px`
        ringRef.current.style.opacity = isHovering.current ? '0.3' : '0.6'
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{
          width: '4px',
          height: '4px',
          backgroundColor: '#3cd0bd',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:block"
        style={{
          width: '40px',
          height: '40px',
          border: '1px solid #3cd0bd',
          borderRadius: '50%',
          opacity: 0.6,
          transition: 'width 0.3s, height 0.3s, opacity 0.3s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
