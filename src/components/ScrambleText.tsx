import { createElement, useEffect, useRef, useState, type ElementType } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#@$%&XO10'

interface ScrambleTextProps {
  text: string
  /** ms before the decode starts */
  delay?: number
  /** ms per character resolve step */
  speed?: number
  as?: ElementType
  className?: string
  style?: React.CSSProperties
}

/**
 * Terminal-style decrypt effect: characters cycle through random glyphs
 * and lock in left to right. Renders plain text under reduced motion.
 */
export default function ScrambleText({
  text,
  delay = 0,
  speed = 45,
  as: tag = 'span',
  className,
  style,
}: ScrambleTextProps) {
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(reducedMotion ? text : '')
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text)
      return
    }

    let raf = 0
    let start: number | null = null

    const tick = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start - delay

      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }

      // How many characters are locked in so far
      const resolved = Math.floor(elapsed / speed)

      if (resolved >= text.length) {
        setDisplay(text)
        return
      }

      frameRef.current++
      let out = text.slice(0, resolved)
      for (let i = resolved; i < text.length; i++) {
        if (text[i] === ' ') {
          out += ' '
        } else {
          // Re-roll scrambled glyphs every other frame to avoid flicker overload
          out += GLYPHS[(frameRef.current * 7 + i * 13) % GLYPHS.length]
        }
      }
      setDisplay(out)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, delay, speed, reducedMotion])

  //   keeps the line height while the text is still empty
  return createElement(
    tag,
    { className, style, 'aria-label': text },
    display || ' '
  )
}
