import { useEffect, useRef, useState } from 'react'
import { playBoxConfig as CFG } from '../../data/index.js'

const COLORS = CFG.colors

// ── Minimal helpers needed only for slot rendering ─────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

function relativeLuminance(r, g, b) {
  const lin = c => { const s = c/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4) }
  return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b)
}

// Black or white — whichever gives better contrast against `hex`
function onColor(hex) {
  return relativeLuminance(...hexToRgb(hex)) > 0.179 ? '#000000' : '#ffffff'
}

function aabbHit(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

// Fisher-Yates shuffle — returns a new array, original untouched
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── B/T slot ───────────────────────────────────────────────────

function BtSlot({ letter, caption, color, slotRef }) {
  const fg = color ? onColor(color) : null
  return (
    <div
      className={`bt-slot${color ? ' bt-slot--filled' : ''}`}
      ref={slotRef}
      style={color ? { background: color, borderColor: color } : undefined}
    >
      <span className="bt-letter" style={fg ? { color: fg } : undefined}>{letter}</span>
      <span className="bt-caption" style={fg ? { color: fg } : undefined}>{caption}</span>
    </div>
  )
}

// ── PlayBox ────────────────────────────────────────────────────
// bt and setBt are owned by the parent (HomePage) so that the
// contrast / power stats can be shown in the page-level stats nav.

export default function PlayBox({ bt, setBt }) {
  const boxRef = useRef(null)
  const bRef   = useRef(null)
  const tRef   = useRef(null)
  const cbRef  = useRef(null)

  const [restartKey, setRestartKey] = useState(0)

  cbRef.current = (slot, color) => setBt(prev => ({ ...prev, [slot]: color }))

  const swapEnabled = !!(bt.B && bt.T)

  function handleSwap() {
    setBt(prev => ({ B: prev.T, T: prev.B }))
  }

  function handleRestart() {
    setBt({ B: null, T: null })
    setRestartKey(k => k + 1)
  }

  // ── Physics + drag ────────────────────────────────────────────
  // restartKey is the only dependency: incrementing it replays the
  // entrance gravity animation by triggering cleanup + re-run.
  // The physics loop and drag handler are bit-for-bit identical to
  // the original implementation.
  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    let W = box.offsetWidth
    let H = box.offsetHeight
    const SIZE = Math.max(CFG.sizeMin, Math.min(CFG.sizeMax, Math.round(W * CFG.sizeRatio)))

    const ro = new ResizeObserver(() => { W = box.offsetWidth; H = box.offsetHeight })
    ro.observe(box)

    // ── Create blocks ─────────────────────────────────────────
    // Shuffle so every restart gives a different layout, and each
    // block gets a unique color (count === COLORS.length by design).
    const colorOrder = shuffle(COLORS)
    const blocks = Array.from({ length: CFG.count }, (_, i) => {
      const el    = document.createElement('div')
      const color = colorOrder[i % colorOrder.length]
      const x     = Math.random() * (W - SIZE)
      const y     = Math.random() * (H * 0.35)

      const isWhite = color.toUpperCase() === '#FFFFFF'
      const isBlack = color.toUpperCase() === '#000000'

      Object.assign(el.style, {
        position:     'absolute',
        width:        SIZE + 'px',
        height:       SIZE + 'px',
        background:   color,
        borderRadius: '4px',
        mixBlendMode: (isWhite || isBlack) ? 'normal' : 'multiply',
        cursor:       'grab',
        touchAction:  'none',
        userSelect:   'none',
        left:         x + 'px',
        top:          y + 'px',
      })
      if (isWhite) el.style.boxShadow = 'inset 0 0 0 1.5px rgba(0,0,0,0.13)'

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
        settled:  false,
        _t1:      null,
        _t2:      null,
      }
    })

    // ── Physics loop (UNCHANGED) ──────────────────────────────
    let rafId

    function tick() {
      for (const b of blocks) {
        if (b.gone || b.dragging) continue
        const gravity  = b.settled ? CFG.gravity      : CFG.gravitySpawn
        const bounce   = b.settled ? CFG.bounce       : CFG.bounceSpawn
        const friction = b.settled ? CFG.friction     : CFG.frictionSpawn
        const sleep    = b.settled ? CFG.sleep        : CFG.sleepSpawn
        b.vY += gravity
        b.x  += b.vX
        b.y  += b.vY
        if (b.y + SIZE >= H) {
          b.y = H - SIZE
          if (Math.abs(b.vY) < sleep * 3) { b.vY = 0; b.settled = true }
          else b.vY = -b.vY * bounce
          b.vX *= friction
        }
        if (b.y < 0)        { b.y = 0;        b.vY =  Math.abs(b.vY) * bounce }
        if (b.x < 0)        { b.x = 0;        b.vX =  Math.abs(b.vX) * bounce }
        if (b.x + SIZE > W) { b.x = W - SIZE; b.vX = -Math.abs(b.vX) * bounce }
        if (Math.abs(b.vX) < sleep * 0.3) b.vX = 0
      }

      for (let pass = 0; pass < 4; pass++) {
        for (let i = 0; i < blocks.length - 1; i++) {
          for (let j = i + 1; j < blocks.length; j++) {
            const a = blocks[i], b = blocks[j]
            if (a.gone || b.gone || a.dragging || b.dragging) continue
            const dx = a.x - b.x, dy = a.y - b.y
            const ox = SIZE - Math.abs(dx), oy = SIZE - Math.abs(dy)
            if (ox <= 0 || oy <= 0) continue
            if (ox < oy) {
              const push = (ox / 2) * Math.sign(dx)
              a.x += push; b.x -= push
              a.vX *= 0.4; b.vX *= 0.4
            } else {
              const push = (oy / 2) * Math.sign(dy)
              a.y += push; b.y -= push
              if (a.y > b.y) {
                if (b.settled) { if (b.vY > a.vY) b.vY *= 0.25; if (a.vY < 0) a.vY = 0 }
                else { const relV = b.vY - a.vY; if (relV > 0) b.vY = a.vY - CFG.bounceSpawn * relV; if (a.settled && a.vY < 0) a.vY = 0 }
              } else {
                if (a.settled) { if (a.vY > b.vY) a.vY *= 0.25; if (b.vY < 0) b.vY = 0 }
                else { const relV = a.vY - b.vY; if (relV > 0) a.vY = b.vY - CFG.bounceSpawn * relV; if (b.settled && b.vY < 0) b.vY = 0 }
              }
            }
            a.x = Math.max(0, Math.min(W - SIZE, a.x))
            b.x = Math.max(0, Math.min(W - SIZE, b.x))
            a.y = Math.max(0, Math.min(H - SIZE, a.y))
            b.y = Math.max(0, Math.min(H - SIZE, b.y))
          }
        }
      }

      for (const b of blocks) {
        if (b.gone || b.dragging) continue
        b.el.style.left = b.x + 'px'
        b.el.style.top  = b.y + 'px'
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    // ── Block consumption ─────────────────────────────────────
    function consumeBlock(block) {
      block.gone     = true
      block.dragging = false
      block.el.style.pointerEvents = 'none'
      void block.el.getBoundingClientRect()
      block.el.style.transition = 'transform 0.16s ease, opacity 0.16s ease'
      block.el.style.transform  = 'scale(0.25)'
      block.el.style.opacity    = '0'
      block._t2 = setTimeout(() => {
        if (block.el?.parentNode) block.el.parentNode.removeChild(block.el)
        block.el = null
      }, 200)
    }

    // ── Drag (UNCHANGED except B/T detection in onPointerUp) ──
    let active  = null
    let offsetX = 0, offsetY = 0
    let prevX   = 0, prevY   = 0

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
      document.body.appendChild(block.el)
      Object.assign(block.el.style, {
        position:   'fixed',
        left:       rect.left + 'px',
        top:        rect.top  + 'px',
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

      const elRect = block.el.getBoundingClientRect()

      // ── B/T drop detection — before inside/outside check ───
      const bRect = bRef.current?.getBoundingClientRect()
      const tRect = tRef.current?.getBoundingClientRect()

      if (bRect && aabbHit(elRect, bRect)) {
        cbRef.current('B', block.color)
        consumeBlock(block)
        return
      }
      if (tRect && aabbHit(elRect, tRect)) {
        cbRef.current('T', block.color)
        consumeBlock(block)
        return
      }

      // ── Original inside/outside logic (UNCHANGED) ─────────
      const centerX = elRect.left + SIZE / 2
      const centerY = elRect.top  + SIZE / 2
      const boxRect = box.getBoundingClientRect()

      const inside =
        centerX >= boxRect.left && centerX <= boxRect.right &&
        centerY >= boxRect.top  && centerY <= boxRect.bottom

      if (inside) {
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
        // Block released outside the play-box — update B and run blast.
        // B updates immediately so the slot + body background change as
        // the explosion plays, making the two feel connected.
        cbRef.current('B', block.color)

        block.gone              = true
        block.el.style.pointerEvents = 'none'
        block.el.style.cursor   = 'default'
        block.el.style.transition = 'none'
        block.el.style.position = 'fixed'
        block.el.style.left     = elRect.left + 'px'
        block.el.style.top      = elRect.top  + 'px'
        block.el.style.background = `radial-gradient(circle at 34% 28%, #FFF 0%, ${block.color} 52%, rgba(0,0,0,0.45) 100%)`
        void block.el.getBoundingClientRect()
        block.el.style.transition   = `transform ${0.4}s cubic-bezier(0.34,1.4,0.64,1), border-radius ${0.4}s ease`
        block.el.style.transform    = `scale(${CFG.inflateScale})`
        block.el.style.borderRadius = '50%'
        block._t1 = setTimeout(() => {
          if (!block.el) return
          block.el.style.background  = block.color
          block.el.style.transition  = `transform ${CFG.blastDurationMs/1000}s cubic-bezier(0.22,0.7,0.3,1), opacity ${CFG.blastDurationMs/1000}s ease-in`
          block.el.style.transform   = `scale(${CFG.blastScale})`
          block.el.style.opacity     = '0'
        }, CFG.inflateDelayMs)
        block._t2 = setTimeout(() => {
          if (block.el?.parentNode) block.el.parentNode.removeChild(block.el)
          block.el = null
        }, CFG.inflateDelayMs + CFG.blastDurationMs)
      }
    }

    blocks.forEach(b => b.el.addEventListener('pointerdown', onPointerDown))

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
  }, [restartKey])

  const bothSet = bt.B && bt.T

  return (
    <div className="portrait-frame">
      <div
        className="play-box"
        ref={boxRef}
        id="playBox"
        data-no-cursor
      >
        {/* ── UI layer — pointer-events:none on container so blocks
            remain draggable beneath; interactive children re-enable. */}
        <div className="pb-ui">
          <span
            className="play-hint"
          >
            {bothSet
              ? 'B + T assigned—drag a new color to try another pair'
              : 'Drag a color onto B or T'}
          </span>

          <div className="bt-row">
            <BtSlot letter="B" caption="background" color={bt.B} slotRef={bRef} />
            <button
              className="swap-btn"
              onClick={handleSwap}
              disabled={!swapEnabled}
              aria-label="Swap background and text colors"
            >⇄</button>
            <BtSlot letter="T" caption="text" color={bt.T} slotRef={tRef} />
          </div>
        </div>

        <button
          className="restart-btn"
          onClick={handleRestart}
          aria-label="Reset colors and respawn blocks"
        >↺ Restart</button>
      </div>
    </div>
  )
}
