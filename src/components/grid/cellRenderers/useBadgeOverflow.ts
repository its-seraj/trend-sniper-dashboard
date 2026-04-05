import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * Returns how many badges fit in the container.
 * Re-calculates whenever the container is resized (column drag).
 */
export function useBadgeOverflow(count: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(count)

  const recalculate = useCallback(() => {
    const container = containerRef.current
    const measureEl = measureRef.current
    if (!container || !measureEl || !count) return

    const containerWidth = container.clientWidth
    const badges = Array.from(measureEl.querySelectorAll<HTMLElement>('[data-badge]'))
    const OVERFLOW_BADGE_WIDTH = 30 // approx width of "+N"
    const GAP = 4

    let used = 0
    let fit = 0
    for (const badge of badges) {
      const w = badge.offsetWidth + GAP
      const remaining = count - fit - 1 // how many would be hidden after this one
      // reserve space for +N only if there will be hidden items
      const reserve = remaining > 0 ? OVERFLOW_BADGE_WIDTH + GAP : 0
      if (used + w + reserve > containerWidth) break
      used += w
      fit++
    }

    setVisible(fit)
  }, [count])

  useEffect(() => {
    if (!containerRef.current) return
    recalculate()
    const ro = new ResizeObserver(recalculate)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [recalculate])

  return { containerRef, measureRef, visible }
}
