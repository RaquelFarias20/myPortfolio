import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let x = -200, y = -200
    let rafId
    let visible = true

    function render() {
      cursor.style.left = x + 'px'
      cursor.style.top  = y + 'px'
      rafId = requestAnimationFrame(render)
    }

    function onMouseMove(e) {
      x = e.clientX
      y = e.clientY
    }

    // Hide when hovering over the play-box zone, show everywhere else
    function onMouseOver(e) {
      const inNoZone = !!e.target.closest('[data-no-cursor]')
      if (inNoZone === visible) {
        visible = !inNoZone
        cursor.style.opacity = visible ? '1' : '0'
      }
    }

    // Hide when leaving the window
    function onMouseLeave() { cursor.style.opacity = '0' }
    function onMouseEnter() { if (visible) cursor.style.opacity = '1' }

    document.addEventListener('mousemove',  onMouseMove)
    document.addEventListener('mouseover',  onMouseOver)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove',  onMouseMove)
      document.removeEventListener('mouseover',  onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  return <div className="custom-cursor" ref={cursorRef} aria-hidden="true" />
}
