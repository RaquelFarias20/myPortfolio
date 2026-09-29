import { useState, useRef, useEffect, useCallback } from 'react'

// ── Constants ─────────────────────────────────────────────────────────
const DESKTOP_W = 380
const MOBILE_W  = 190
const LABEL_H   = 26
const FRAME_GAP = 40
const MIN_SCALE = 0.15
const MAX_SCALE = 3.5
const MOBILE_BP = 768

// ── Helpers ───────────────────────────────────────────────────────────
function dispSize(screen) {
  const w = screen.kind === 'mobile' ? MOBILE_W : DESKTOP_W
  return { w, h: Math.round(w * (screen.height / screen.width)) }
}
function mobileLayout(screens) {
  const pos = {}
  let dy = 0, my = 0
  screens.filter(s => s.kind === 'desktop').forEach(s => { pos[s.id] = { x: 0,                  y: dy }; dy += dispSize(s).h + FRAME_GAP })
  screens.filter(s => s.kind === 'mobile' ).forEach(s => { pos[s.id] = { x: DESKTOP_W + FRAME_GAP, y: my }; my += dispSize(s).h + FRAME_GAP })
  return pos
}
function desktopLayout(screens) { return Object.fromEntries(screens.map(s => [s.id, s.canvas])) }

function requestFull(el) { return el?.requestFullscreen?.() ?? el?.webkitRequestFullscreen?.() ?? Promise.resolve() }
function exitFull()       { return document.exitFullscreen?.() ?? document.webkitExitFullscreen?.() }
function isFull()         { return !!(document.fullscreenElement || document.webkitFullscreenElement) }

// ── Icons ─────────────────────────────────────────────────────────────
function IconSelect()   { return <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true"><path d="M0.5 0.5l3.8 11.5 1.9-4.3 4.3-1.9L0.5 0.5z"/></svg> }
function IconHand()     { return <svg width="13" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0v0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg> }
function IconPanel()    { return <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><rect x="0.75" y="0.75" width="12.5" height="9.5" rx="1.25"/><line x1="4.5" y1="0.75" x2="4.5" y2="10.25"/></svg> }
function IconExpand()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg> }
function IconCollapse() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg> }
function IconDesktop()  { return <svg width="13" height="11" viewBox="0 0 13 11" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true"><rect x="0.6" y="0.6" width="11.8" height="8" rx="1"/><line x1="4.5" y1="8.6" x2="4.5" y2="10.4"/><line x1="8.5" y1="8.6" x2="8.5" y2="10.4"/><line x1="3" y1="10.4" x2="10" y2="10.4"/></svg> }
function IconMobile()   { return <svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true"><rect x="0.6" y="0.6" width="6.8" height="11.8" rx="1.5"/><line x1="2.8" y1="10.8" x2="5.2" y2="10.8"/></svg> }

// ── ScreenProps ───────────────────────────────────────────────────────
function ScreenProps({ screen }) {
  if (!screen) {
    return <p className="mcv-props__empty">Select a screen to see its properties.</p>
  }
  return (
    <>
      {/* Name + kind tag */}
      <div className="mcv-props__sect mcv-props__sect--name">
        <span className="mcv-props__name">{screen.name}</span>
        <span className="mcv-props__tag">{screen.kind === 'mobile' ? 'Mobile' : 'Desktop'}</span>
      </div>

      {/* Description */}
      <div className="mcv-props__sect">
        <p className="mcv-props__sect-label">Description</p>
        <p className="mcv-props__desc">{screen.description}</p>
      </div>

      {/* Size */}
      <div className="mcv-props__sect">
        <p className="mcv-props__sect-label">Size</p>
        <div className="mcv-props__dims">
          <div className="mcv-props__dim"><span className="mcv-props__dim-key">W</span><span className="mcv-props__dim-val">{screen.width}</span></div>
          <div className="mcv-props__dim"><span className="mcv-props__dim-key">H</span><span className="mcv-props__dim-val">{screen.height}</span></div>
        </div>
      </div>

      {/* Colors */}
      {screen.colors?.length > 0 && (
        <div className="mcv-props__sect">
          <p className="mcv-props__sect-label">Colors</p>
          <div className="mcv-props__colors">
            {screen.colors.map(c => (
              <div key={c.hex} className="mcv-props__color-row">
                <div className="mcv-props__swatch" style={{ background: c.hex }} aria-hidden="true" />
                <span className="mcv-props__hex">{c.hex}</span>
                <span className="mcv-props__color-label">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// ── ScreenFrame ───────────────────────────────────────────────────────
function ScreenFrame({ screen, pos, selected, onClick, onDblClick }) {
  const { w, h } = dispSize(screen)
  return (
    <div
      className={`mcv-frame${selected ? ' mcv-frame--sel' : ''}${screen.image ? '' : ' mcv-frame--empty'}`}
      style={{ left: pos.x, top: pos.y + LABEL_H, width: w, height: h }}
      role="button" tabIndex={-1}
      aria-label={screen.name} aria-pressed={selected}
      onClick={onClick} onDoubleClick={onDblClick}
    >
      <span className="mcv-frame__label">{screen.name}</span>
      {screen.image
        ? <img src={screen.image} srcSet={screen.image2x ? `${screen.image} 1x, ${screen.image2x} 2x` : undefined} alt={screen.name} className="mcv-frame__img" loading="lazy" draggable={false} />
        : <div className="mcv-frame__placeholder"><span>[Screen export]</span></div>
      }
    </div>
  )
}

// ── MiCasaScreenViewer ────────────────────────────────────────────────
export default function MiCasaScreenViewer({ screens }) {
  const [tool,       setTool]       = useState('select')
  const [selectedId, setSelectedId] = useState(null)
  const [sheetOpen,  setSheetOpen]  = useState(false)
  const [panelOpen,  setPanelOpen]  = useState(false)
  const [isFullscr,  setIsFullscr]  = useState(false)
  const [isMobile,   setIsMobile]   = useState(() => window.innerWidth < MOBILE_BP)

  const mcvRef     = useRef(null)
  const wrapRef    = useRef(null)
  const innerRef   = useRef(null)
  const zoomRef    = useRef(null)
  const toolRef    = useRef('select')
  const focusedRef = useRef(false)
  const txRef      = useRef({ x: 0, y: 0, scale: 1 })
  const panRef      = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 })
  const pinchRef    = useRef({ dist: 0, mid: { x: 0, y: 0 } })
  const touchMovRef = useRef(false)
  const justPannedRef = useRef(false)
  const wheelAcc   = useRef({ delta: 0, x: 0, y: 0, raf: null })
  const prevPanel  = useRef(true)

  const selectedScreen = screens.find(s => s.id === selectedId) ?? null

  useEffect(() => { toolRef.current = tool }, [tool])

  const applyTx = useCallback(t => {
    txRef.current = t
    if (innerRef.current) innerRef.current.style.transform = `translate(${t.x}px,${t.y}px) scale(${t.scale})`
    if (zoomRef.current) zoomRef.current.textContent = Math.round(t.scale * 100) + '%'
  }, [])

  const getPositions = useCallback(() =>
    window.innerWidth < MOBILE_BP ? mobileLayout(screens) : desktopLayout(screens),
  [screens])

  const fitAll = useCallback(() => {
    const el = wrapRef.current; if (!el || !screens.length) return
    const { width, height } = el.getBoundingClientRect(); if (!width || !height) return
    const pos = getPositions()
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    screens.forEach(s => {
      const p = pos[s.id]; if (!p) return
      const { w, h } = dispSize(s)
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y)
      x1 = Math.max(x1, p.x + w); y1 = Math.max(y1, p.y + LABEL_H + h)
    })
    const pad = 52, cw = x1 - x0 + pad * 2, ch = y1 - y0 + pad * 2
    const sc = Math.min(width / cw, height / ch, 1.5)
    applyTx({ x: (width - cw*sc)/2 - x0*sc + pad*sc, y: (height - ch*sc)/2 - y0*sc + pad*sc, scale: sc })
  }, [screens, getPositions, applyTx])

  const zoomToScreen = useCallback(id => {
    const s = screens.find(x => x.id === id); const el = wrapRef.current
    if (!s || !el) return
    const pos = getPositions()[id]; if (!pos) return
    const { w, h } = dispSize(s)
    const { width, height } = el.getBoundingClientRect()
    const sc = Math.min(width / (w * 1.15), height / (h * 1.15), 2.5)
    applyTx({ x: width/2 - (pos.x + w/2)*sc, y: height/2 - (pos.y + LABEL_H + h/2)*sc, scale: sc })
  }, [screens, getPositions, applyTx])

  useEffect(() => {
    const t = setTimeout(fitAll, 60)
    const onResize = () => {
      setIsMobile(prev => { const m = window.innerWidth < MOBILE_BP; return m !== prev ? m : prev })
      fitAll()
    }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [fitAll])

  useEffect(() => { fitAll() }, [isMobile, fitAll])

  // Fullscreen change
  useEffect(() => {
    const onChange = () => {
      const full = isFull()
      setIsFullscr(full)
      if (full) {
        setTimeout(fitAll, 140)
      } else {
        setPanelOpen(prevPanel.current)
        setTimeout(fitAll, 60)
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [fitAll])

  // Wheel + touch (non-passive)
  useEffect(() => {
    const el = wrapRef.current; if (!el) return

    function doZoom(delta, cx, cy) {
      const t = txRef.current, rect = el.getBoundingClientRect()
      const mx = cx - rect.left, my = cy - rect.top
      const ns = Math.max(MIN_SCALE, Math.min(MAX_SCALE, t.scale * (1 + delta)))
      const r  = ns / t.scale
      applyTx({ x: mx - r*(mx - t.x), y: my - r*(my - t.y), scale: ns })
    }

    function normalizeWheel(e) {
      let raw = e.deltaMode === 1 ? -e.deltaY * 0.07 : e.deltaMode === 2 ? -e.deltaY * 1.2 : -e.deltaY * 0.006
      return Math.sign(raw) * Math.min(Math.abs(raw), 0.3)
    }

    function onWheel(e) {
      if (!focusedRef.current) return
      e.preventDefault()
      const acc = wheelAcc.current
      acc.delta += normalizeWheel(e); acc.x = e.clientX; acc.y = e.clientY
      if (!acc.raf) acc.raf = requestAnimationFrame(() => { doZoom(acc.delta, acc.x, acc.y); acc.delta = 0; acc.raf = null })
    }

    function onTouchStart(e) {
      touchMovRef.current = false
      if (e.touches.length === 1) {
        const t = e.touches[0]
        panRef.current = { active: true, sx: t.clientX, sy: t.clientY, ox: txRef.current.x, oy: txRef.current.y }
      }
      if (e.touches.length === 2) {
        e.preventDefault()
        const a = e.touches[0], b = e.touches[1]
        pinchRef.current = { dist: Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY), mid: { x: (a.clientX+b.clientX)/2, y: (a.clientY+b.clientY)/2 } }
      }
    }

    function onTouchMove(e) {
      if (e.touches.length === 1) {
        const t = e.touches[0], dx = t.clientX - panRef.current.sx, dy = t.clientY - panRef.current.sy
        if (Math.hypot(dx, dy) > 5) touchMovRef.current = true
        if (!touchMovRef.current) return
        e.preventDefault()
        applyTx({ x: panRef.current.ox + dx, y: panRef.current.oy + dy, scale: txRef.current.scale })
      }
      if (e.touches.length === 2) {
        e.preventDefault(); touchMovRef.current = true
        const a = e.touches[0], b = e.touches[1]
        const mid = { x: (a.clientX+b.clientX)/2, y: (a.clientY+b.clientY)/2 }
        const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY)
        const pDelta = dist / pinchRef.current.dist
        const panDx = mid.x - pinchRef.current.mid.x, panDy = mid.y - pinchRef.current.mid.y
        pinchRef.current = { dist, mid }
        const cur = txRef.current, rect = el.getBoundingClientRect()
        const cx = mid.x - rect.left, cy = mid.y - rect.top
        const ns = Math.max(MIN_SCALE, Math.min(MAX_SCALE, cur.scale * pDelta)), r = ns / cur.scale
        applyTx({ x: cx - r*(cx-cur.x) + panDx, y: cy - r*(cy-cur.y) + panDy, scale: ns })
      }
    }

    el.addEventListener('wheel',      onWheel,      { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    return () => {
      el.removeEventListener('wheel',      onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
    }
  }, [applyTx])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = e => {
      if (!focusedRef.current) return
      if (e.key === 'v' || e.key === 'V') setTool('select')
      if (e.key === 'h' || e.key === 'H') setTool('hand')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function onPointerDown(e) {
    if (e.pointerType === 'touch') return
    focusedRef.current = true
    justPannedRef.current = false
    if (toolRef.current === 'hand') {
      panRef.current = { active: true, sx: e.clientX, sy: e.clientY, ox: txRef.current.x, oy: txRef.current.y }
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }
  function onPointerMove(e) {
    if (e.pointerType === 'touch' || !panRef.current.active || toolRef.current !== 'hand') return
    const dx = e.clientX - panRef.current.sx, dy = e.clientY - panRef.current.sy
    if (Math.hypot(dx, dy) > 4) justPannedRef.current = true
    applyTx({ x: panRef.current.ox + dx, y: panRef.current.oy + dy, scale: txRef.current.scale })
  }
  function onPointerUp() { panRef.current = { ...panRef.current, active: false } }
  function onCanvasClick() { if (!justPannedRef.current) { setSelectedId(null); setSheetOpen(false) } }
  function selectScreen(id) { setSelectedId(id); setSheetOpen(true) }

  async function openFullscreen(screenId) {
    prevPanel.current = panelOpen
    setPanelOpen(false)
    try {
      if (!isFull()) await requestFull(mcvRef.current)
      if (screenId) setTimeout(() => { selectScreen(screenId); zoomToScreen(screenId) }, 160)
    } catch { setPanelOpen(prevPanel.current) }
  }

  const positions = isMobile ? mobileLayout(screens) : desktopLayout(screens)

  return (
    <div ref={mcvRef} className={`mcv${isFullscr ? ' mcv--fs' : ''}`} data-no-cursor>

      {/* ── Top bar ─────────────────────────────────── */}
      <div className="mcv__bar">
        <div className="mcv__bar-left">
          {/* Panel toggle — desktop only */}
          <button className="mcv__tool mcv__tool--toggle" onClick={() => setPanelOpen(p => !p)} aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'} title={panelOpen ? 'Collapse panel' : 'Expand panel'}>
            <IconPanel />
          </button>
          <div className="mcv__tools">
            <button className={`mcv__tool${tool === 'select' ? ' mcv__tool--on' : ''}`} onClick={() => setTool('select')} aria-pressed={tool === 'select'} aria-label="Select (V)" title="Select (V)"><IconSelect /></button>
            <button className={`mcv__tool${tool === 'hand' ? ' mcv__tool--on' : ''}`}   onClick={() => setTool('hand')}   aria-pressed={tool === 'hand'}   aria-label="Hand (H)"   title="Hand (H)"><IconHand /></button>
          </div>
        </div>

        {/* Breadcrumb title */}
        <span className="mcv__title">
          MiCasa screens
          {isFullscr && selectedScreen && <><span className="mcv__title-sep"> / </span>{selectedScreen.name}</>}
        </span>

        <div className="mcv__bar-right">
          <span className="mcv__zoom" ref={zoomRef}>100%</span>

          {/* Full screen button — always visible and active */}
          <button
            className={`mcv__fs-btn${isFullscr ? ' mcv__fs-btn--exit' : ''}`}
            onClick={isFullscr ? () => exitFull() : () => openFullscreen(selectedId)}
            aria-label={isFullscr ? 'Exit full screen' : 'Full screen'}
            title={isFullscr ? 'Exit full screen (Esc)' : 'Full screen'}
          >
            {isFullscr ? <IconCollapse /> : <IconExpand />}
            <span className="mcv__fs-btn-text">{isFullscr ? 'Exit full screen' : 'Full screen'}</span>
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────── */}
      <div className="mcv__body">

        {/* Left panel — desktop only, hidden in fullscreen via CSS */}
        <aside className={`mcv__panel${panelOpen ? '' : ' mcv__panel--collapsed'}`} aria-label="Screens and properties" aria-hidden={!panelOpen}>

          {/* Screens section */}
          <div className="mcv__panel-head">
            <span className="mcv__panel-sec">Screens</span>
            <span className="mcv__panel-count">{screens.length}</span>
          </div>
          <ul className="mcv__list" role="list">
            {screens.map(s => (
              <li key={s.id}>
                <button
                  className={`mcv__row${selectedId === s.id ? ' mcv__row--on' : ''}`}
                  onClick={() => selectScreen(s.id)}
                  aria-pressed={selectedId === s.id}
                  tabIndex={panelOpen ? 0 : -1}
                >
                  <span className="mcv__row-icon" aria-hidden="true">{s.kind === 'mobile' ? <IconMobile /> : <IconDesktop />}</span>
                  {s.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Properties section */}
          <div className="mcv__panel-head mcv__panel-head--props">
            <span className="mcv__panel-sec">Properties</span>
          </div>
          <div className="mcv__panel-props">
            <ScreenProps screen={selectedScreen} />
          </div>
        </aside>

        {/* Canvas */}
        <div
          ref={wrapRef}
          className={`mcv__canvas mcv__canvas--${tool}`}
          tabIndex={0}
          aria-label="Screen canvas — scroll to zoom, drag to pan, V/H to switch tools"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={onCanvasClick}
          onFocus={() => { focusedRef.current = true }}
          onBlur={() => { focusedRef.current = false }}
        >
          <div ref={innerRef} className="mcv__inner" style={{ transformOrigin: '0 0' }}>
            {screens.map(s => (
              <ScreenFrame
                key={s.id}
                screen={s}
                pos={positions[s.id] ?? s.canvas}
                selected={selectedId === s.id}
                onClick={e => { e.stopPropagation(); if (!touchMovRef.current && !justPannedRef.current) selectScreen(s.id) }}
                onDblClick={e => { e.stopPropagation(); if (isFull()) { selectScreen(s.id); zoomToScreen(s.id) } else openFullscreen(s.id) }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom sheet (mobile / tablet) ──────────── */}
      {sheetOpen && selectedScreen && (
        <div className="mcv__sheet" role="dialog" aria-modal="true" aria-label={selectedScreen.name}>
          <div className="mcv__sheet-head">
            <span className="mcv__sheet-handle" aria-hidden="true" />
            <button className="mcv__sheet-close" onClick={() => { setSheetOpen(false); setSelectedId(null) }} aria-label="Close">&#x2715;</button>
          </div>
          <div className="mcv__sheet-scroll">
            <ScreenProps screen={selectedScreen} />
          </div>
          <div className="mcv__sheet-foot">
            <button className="mcv__view-btn" onClick={() => openFullscreen(selectedId)} disabled={!selectedScreen.image}>
              View full screen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
