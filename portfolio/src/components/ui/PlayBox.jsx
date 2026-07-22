import { useEffect, useRef } from 'react'
import { playBoxConfig as CFG } from '../../data/index.js'

const COLORS = CFG.colors

export default function PlayBox() {
  const boxRef = useRef(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    // Live box dimensions — updated on resize
    let W = box.offsetWidth
    let H = box.offsetHeight

    // Block size computed from initial box width so blocks scale with viewport
    const SIZE = Math.max(CFG.sizeMin, Math.min(CFG.sizeMax, Math.round(W * CFG.sizeRatio)))

    const ro = new ResizeObserver(() => {
      W = box.offsetWidth
      H = box.offsetHeight
    })
    ro.observe(box)

    // ── Create blocks imperatively ──────────────────────────────
    const blocks = Array.from({ length: CFG.count }, (_, i) => {
      const el = document.createElement('div')
      const color = COLORS[i % COLORS.length]
      const x = Math.random() * (W - SIZE)
      const y = Math.random() * (H * 0.35)

      Object.assign(el.style, {
        position:     'absolute',
        width:        SIZE + 'px',
        height:       SIZE + 'px',
        background:   color,
        borderRadius: '4px',
        mixBlendMode: 'multiply',
        cursor:       'grab',
        touchAction:  'none',
        userSelect:   'none',
        left:         x + 'px',
        top:          y + 'px',
      })
      box.appendChild(el)

      return {
        id:       i,
        el,
        color,
        x,
        y,
        vX:       (Math.random() - 0.5) * 3,
        vY:       0,
        gone:     false,
        dragging: false,
        _t1:      null,
        _t2:      null,
      }
    })

    // ── Physics loop ────────────────────────────────────────────
    let rafId

    function tick() {
      // Integrate
      for (const b of blocks) {
        if (b.gone || b.dragging) continue

        b.vY += CFG.gravity
        b.x  += b.vX
        b.y  += b.vY

        // Floor
        if (b.y + SIZE >= H) {
          b.y = H - SIZE
          if (Math.abs(b.vY) < CFG.sleep * 3) b.vY = 0
          else b.vY = -b.vY * CFG.bounce
          b.vX *= CFG.friction
        }
        // Ceiling
        if (b.y < 0) { b.y = 0; b.vY = Math.abs(b.vY) * CFG.bounce }
        // Left wall
        if (b.x < 0) { b.x = 0; b.vX = Math.abs(b.vX) * CFG.bounce }
        // Right wall
        if (b.x + SIZE > W) { b.x = W - SIZE; b.vX = -Math.abs(b.vX) * CFG.bounce }
        // Zero micro-drift
        if (Math.abs(b.vX) < CFG.sleep * 0.3) b.vX = 0
      }

      // Collision — 2 passes required to prevent jitter in resting stacks
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < blocks.length - 1; i++) {
          for (let j = i + 1; j < blocks.length; j++) {
            const a = blocks[i], b = blocks[j]
            if (a.gone || b.gone || a.dragging || b.dragging) continue

            const dx = a.x - b.x
            const dy = a.y - b.y
            const ox = SIZE - Math.abs(dx)
            const oy = SIZE - Math.abs(dy)
            if (ox <= 0 || oy <= 0) continue

            if (ox < oy) {
              // Horizontal resolution
              const push = (ox / 2) * Math.sign(dx)
              a.x += push; b.x -= push
              a.vX *= 0.4; b.vX *= 0.4
            } else {
              // Vertical resolution
              const push = (oy / 2) * Math.sign(dy)
              a.y += push; b.y -= push
              if (a.y > b.y) { a.vY = 0; b.vY *= 0.25 }
              else            { b.vY = 0; a.vY *= 0.25 }
            }

            // Clamp after each resolution
            a.x = Math.max(0, Math.min(W - SIZE, a.x))
            b.x = Math.max(0, Math.min(W - SIZE, b.x))
            a.y = Math.max(0, Math.min(H - SIZE, a.y))
            b.y = Math.max(0, Math.min(H - SIZE, b.y))
          }
        }
      }

      // Write positions to DOM
      for (const b of blocks) {
        if (b.gone || b.dragging) continue
        b.el.style.left = b.x + 'px'
        b.el.style.top  = b.y + 'px'
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    // ── Drag ────────────────────────────────────────────────────
    let active  = null
    let offsetX = 0, offsetY = 0
    let prevX   = 0, prevY   = 0
    let hintFaded = false
    const hint = box.querySelector('.play-hint')

    function onPointerDown(e) {
      if (active) return
      const block = blocks.find(b => b.el === e.currentTarget)
      if (!block || block.gone) return
      e.preventDefault()

      active = block
      block.dragging = true

      const rect = block.el.getBoundingClientRect()
      offsetX = e.clientX - rect.left
      offsetY = e.clientY - rect.top
      prevX   = e.clientX
      prevY   = e.clientY

      // Portal to document.body — escapes any stacking context that
      // would break mix-blend-mode: multiply on the dragged block
      document.body.appendChild(block.el)
      Object.assign(block.el.style, {
        position:   'fixed',
        left:       rect.left + 'px',
        top:        rect.top + 'px',
        zIndex:     '999',
        cursor:     'grabbing',
        transition: 'none',
      })

      document.addEventListener('pointermove',   onPointerMove,  { passive: false })
      document.addEventListener('pointerup',     onPointerUp)
      document.addEventListener('pointercancel', onPointerUp)
    }

    function onPointerMove(e) {
      if (!active) return
      e.preventDefault()
      active.el.style.left = (e.clientX - offsetX) + 'px'
      active.el.style.top  = (e.clientY - offsetY) + 'px'
      // Carry throw velocity into the simulation on drop
      active.vX = (e.clientX - prevX) * 0.3
      active.vY = (e.clientY - prevY) * 0.3
      prevX = e.clientX
      prevY = e.clientY
    }

    function onPointerUp() {
      if (!active) return
      document.removeEventListener('pointermove',   onPointerMove)
      document.removeEventListener('pointerup',     onPointerUp)
      document.removeEventListener('pointercancel', onPointerUp)

      const block = active
      active = null

      // Fade hint after first successful drag attempt
      if (!hintFaded && hint) {
        hint.style.transition = 'opacity 0.5s ease'
        hint.style.opacity    = '0'
        hintFaded = true
      }

      // Test block CENTER against live box bounds
      const elRect  = block.el.getBoundingClientRect()
      const centerX = elRect.left + SIZE / 2
      const centerY = elRect.top  + SIZE / 2
      const boxRect = box.getBoundingClientRect()

      const inside =
        centerX >= boxRect.left && centerX <= boxRect.right &&
        centerY >= boxRect.top  && centerY <= boxRect.bottom

      if (inside) {
        // Re-parent to box, clamp position, re-enter simulation
        const newX = Math.max(0, Math.min(boxRect.width  - SIZE, centerX - boxRect.left - SIZE / 2))
        const newY = Math.max(0, Math.min(boxRect.height - SIZE, centerY - boxRect.top  - SIZE / 2))
        block.x = newX
        block.y = newY
        Object.assign(block.el.style, {
          position:   'absolute',
          left:       newX + 'px',
          top:        newY + 'px',
          zIndex:     '',
          cursor:     'grab',
          transition: 'none',
        })
        box.appendChild(block.el)
        block.dragging = false
      } else {
        // ── Release sequence ──────────────────────────────────
        // Once outside the box a block is permanently non-interactive
        block.gone              = true
        block.el.style.pointerEvents = 'none'
        block.el.style.cursor   = 'default'
        block.el.style.transition = 'none'

        // Fix position at current viewport coordinates
        block.el.style.position = 'fixed'
        block.el.style.left     = elRect.left + 'px'
        block.el.style.top      = elRect.top  + 'px'

        // t=0 — sphere gradient + inflate (400ms)
        block.el.style.background = `radial-gradient(circle at 34% 28%, #FFF 0%, ${block.color} 52%, rgba(0,0,0,0.45) 100%)`
        // Force reflow so transition fires from current resting state
        void block.el.getBoundingClientRect()
        block.el.style.transition   = `transform ${0.4}s cubic-bezier(0.34,1.4,0.64,1), border-radius ${0.4}s ease`
        block.el.style.transform    = `scale(${CFG.inflateScale})`
        block.el.style.borderRadius = '50%'

        // t=430ms — swap to flat color + blast (600ms)
        block._t1 = setTimeout(() => {
          if (!block.el) return
          block.el.style.background  = block.color
          block.el.style.transition  = `transform ${CFG.blastDurationMs / 1000}s cubic-bezier(0.22,0.7,0.3,1), opacity ${CFG.blastDurationMs / 1000}s ease-in`
          block.el.style.transform   = `scale(${CFG.blastScale})`
          block.el.style.opacity     = '0'
        }, CFG.inflateDelayMs)

        // t=1050ms — remove from DOM
        block._t2 = setTimeout(() => {
          if (block.el?.parentNode) block.el.parentNode.removeChild(block.el)
          block.el = null
        }, CFG.inflateDelayMs + CFG.blastDurationMs)
      }
    }

    // Attach drag listener to each block
    blocks.forEach(b => b.el.addEventListener('pointerdown', onPointerDown))

    // ── Cleanup ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      document.removeEventListener('pointermove',   onPointerMove)
      document.removeEventListener('pointerup',     onPointerUp)
      document.removeEventListener('pointercancel', onPointerUp)
      blocks.forEach(b => {
        if (b._t1) clearTimeout(b._t1)
        if (b._t2) clearTimeout(b._t2)
        if (b.el) {
          b.el.removeEventListener('pointerdown', onPointerDown)
          if (b.el.parentNode) b.el.parentNode.removeChild(b.el)
        }
      })
    }
  }, [])

  return (
    <div className="portrait-frame">
      <div className="play-box" ref={boxRef} id="playBox">
        <span className="play-hint">Drag the blocks</span>
      </div>
    </div>
  )
}
