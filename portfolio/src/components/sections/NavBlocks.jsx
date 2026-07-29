import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import NavBlock from '../ui/NavBlock.jsx'
import { navBlocks } from '../../data/index.js'
import { navContainer, navItem } from '../../animations/variants.js'

// ── Math helpers ───────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

function relativeLuminance(r, g, b) {
  const lin = c => { const s = c/255; return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4) }
  return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b)
}

function contrastRatio(hexA, hexB) {
  const La = relativeLuminance(...hexToRgb(hexA))
  const Lb = relativeLuminance(...hexToRgb(hexB))
  const L1 = Math.max(La, Lb), L2 = Math.min(La, Lb)
  return (L1 + 0.05) / (L2 + 0.05)
}

function screenPower(hex) {
  const [r, g, b] = hexToRgb(hex)
  return (r * 1.0 + g * 0.85 + b * 1.35) / (255 * (1.0 + 0.85 + 1.35)) * 100
}

function powerBarColor(pct) {
  if (pct < 35) return '#22c55e'
  if (pct < 70) return '#f59e0b'
  return '#ef4444'
}

// ── Tooltip ─────────────────────────────────────────────────────

const CONTRAST_TIP = (
  <div>
    <p><strong>WCAG — Web Content Accessibility Guidelines</strong></p>
    <p>Contrast ratio ranges from 1:1 (identical colors, invisible) to 21:1 (pure black on pure white). WCAG defines three pass thresholds:</p>
    <ul>
      <li><strong>AA Large</strong> — 3:1 minimum. Big text (24px+) or icons.</li>
      <li><strong>AA Normal</strong> — 4.5:1 minimum. Regular body text — the baseline most accessibility laws require.</li>
      <li><strong>AAA</strong> — 7:1 minimum. The strict tier.</li>
    </ul>
  </div>
)

const POWER_TIP = (
  <div>
    <p>OLED screens light each pixel individually:</p>
    <ul>
      <li><strong>Black pixels are switched off</strong> — drawing almost no power.</li>
      <li>This estimate compares your background&apos;s draw to full white at the same brightness.</li>
      <li><strong>Hue matters too</strong> — blue subpixels are historically less efficient than green or red.</li>
    </ul>
  </div>
)

function Tooltip({ label, content }) {
  const [open,    setOpen]    = useState(false)
  const [pos,     setPos]     = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const btnRef      = useRef(null)
  const popupRef    = useRef(null)
  const hideTimer   = useRef(null)
  // True while pointer is over the button — lets us distinguish hover
  // (desktop) from tap (touch, which never fires mouseenter).
  const hoverActive = useRef(false)

  // After the popup mounts, measure it and flip/clamp so it always
  // stays within the viewport. Runs before paint → no visible jump.
  useLayoutEffect(() => {
    if (!open || !popupRef.current) return
    const popup = popupRef.current.getBoundingClientRect()
    const btn   = btnRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const GAP = 6

    let x = btn.left
    let y = btn.bottom + GAP

    // Flip above the trigger if it would clip the bottom edge
    if (y + popup.height > vh - 8) {
      y = btn.top - popup.height - GAP
    }

    // Clamp horizontally — align to right edge of trigger if it would overflow
    if (x + popup.width > vw - 8) x = vw - popup.width - 8
    if (x < 8) x = 8

    // Safety vertical clamp
    if (y < 8) y = 8

    setPos({ x, y })
    setVisible(true)
  }, [open])

  function openTooltip() {
    setVisible(false) // hidden until layout effect measures and repositions
    setOpen(true)
  }

  function closeTooltip() {
    setOpen(false)
    setVisible(false)
  }

  function onMouseEnter() {
    clearTimeout(hideTimer.current)
    hoverActive.current = true
    openTooltip()
  }

  function onMouseLeave() {
    hoverActive.current = false
    hideTimer.current = setTimeout(closeTooltip, 120)
  }

  function onClick() {
    // Touch devices never fire mouseenter so hoverActive stays false.
    // On desktop the hover already opened it — click is a no-op.
    if (!hoverActive.current) {
      open ? closeTooltip() : openTooltip()
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') closeTooltip() }
    const onOut = e => { if (btnRef.current && !btnRef.current.contains(e.target)) closeTooltip() }
    document.addEventListener('keydown',     onKey)
    document.addEventListener('pointerdown', onOut)
    return () => {
      document.removeEventListener('keydown',     onKey)
      document.removeEventListener('pointerdown', onOut)
    }
  }, [open])

  useEffect(() => () => clearTimeout(hideTimer.current), [])

  return (
    <>
      <button
        ref={btnRef}
        className="tt-btn"
        aria-label={label}
        aria-expanded={open}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >i</button>
      {open && createPortal(
        <div
          ref={popupRef}
          className="tt-popup"
          role="tooltip"
          style={{
            left:       pos.x + 'px',
            top:        pos.y + 'px',
            visibility: visible ? 'visible' : 'hidden',
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}

// ── BT stat blocks ─────────────────────────────────────────────

function ContrastBlock({ B, T }) {
  const ratio = B && T ? contrastRatio(B, T) : null
  return (
    <motion.div className="stat stat--bt stat--contrast" variants={navItem}>
      <div className="num">{ratio != null ? ratio.toFixed(1) + ':1' : '—'}</div>
      <div className="label label--flex">
        Contrast
        <Tooltip label="About contrast ratio" content={CONTRAST_TIP} />
      </div>
      <div className="stat-sub">Ideal: passes AA (4.5:1+)</div>
      {ratio != null && (
        <div className="stat-badges">
          <span className={`stat-badge ${ratio >= 3   ? 'pass' : 'fail'}`}>AA Large</span>
          <span className={`stat-badge ${ratio >= 4.5 ? 'pass' : 'fail'}`}>AA</span>
          <span className={`stat-badge ${ratio >= 7   ? 'pass' : 'fail'}`}>AAA</span>
        </div>
      )}
    </motion.div>
  )
}

function PowerBlock({ B }) {
  const pct = B ? screenPower(B) : null
  return (
    <motion.div className="stat stat--bt stat--power" variants={navItem}>
      <div className="num">{pct != null ? Math.round(pct) + '%' : '—'}</div>
      <div className="label label--flex">
        Est. screen power
        <Tooltip label="About screen power estimate" content={POWER_TIP} />
      </div>
      <div className="stat-sub">% of full-white background draw, same brightness</div>
      {pct != null && (
        <div className="power-bar-wrap">
          <div
            className="power-bar-fill"
            style={{ width: pct + '%', background: powerBarColor(pct) }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ── NavBlocks ──────────────────────────────────────────────────
// DOM order: CONTRAST + POWER first so they float to the top on
// mobile grid; on desktop CSS `order` props shift them after
// PHOTOGRAPHY and before CONTACT.

export default function NavBlocks({ bt }) {
  const beforeContact = navBlocks.filter(b => b.id !== 'contact')
  const contact       = navBlocks.find(b => b.id === 'contact')

  return (
    <motion.nav
      className="stats"
      aria-label="Primary"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={navContainer}
    >
      <ContrastBlock B={bt.B} T={bt.T} />
      <PowerBlock    B={bt.B} />
      {beforeContact.map(block => (
        <NavBlock key={block.id} {...block} />
      ))}
      {contact && <NavBlock key={contact.id} {...contact} />}
    </motion.nav>
  )
}
