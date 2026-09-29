import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MiCasaScreenViewer from '../ui/MiCasaScreenViewer.jsx'
import { micasaScreens } from '../../data/micasaScreens.js'

function EmbedFrame({ src, label }) {
  const ref = useRef(null)

  useEffect(() => {
    function onMessage(e) {
      if (e.data?.type === 'blueprintHeight' && ref.current && e.source === ref.current.contentWindow) {
        ref.current.style.height = e.data.height + 'px'
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <figure className="embed-frame" data-no-cursor>
      <iframe ref={ref} src={src} title={label ?? 'Embedded content'} />
      {label && <figcaption>{label}</figcaption>}
    </figure>
  )
}

function Lightbox({ images, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const img = images[index]
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowRight' && hasNext) setIndex(i => i + 1)
      if (e.key === 'ArrowLeft'  && hasPrev) setIndex(i => i - 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [hasPrev, hasNext, onClose])

  return createPortal(
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox__close" onClick={onClose} aria-label="Close">&#x2715;</button>

      {hasPrev && (
        <button
          className="lightbox__arrow lightbox__arrow--prev"
          onClick={e => { e.stopPropagation(); setIndex(i => i - 1) }}
          aria-label="Previous image"
        >&#8249;</button>
      )}

      <div className="lightbox__content" onClick={e => e.stopPropagation()}>
        <img src={img.src} alt={img.alt ?? ''} />
        {img.caption && <p className="lightbox__caption">{img.caption}</p>}
      </div>

      {hasNext && (
        <button
          className="lightbox__arrow lightbox__arrow--next"
          onClick={e => { e.stopPropagation(); setIndex(i => i + 1) }}
          aria-label="Next image"
        >&#8250;</button>
      )}

      {images.length > 1 && (
        <div className="lightbox__dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`lightbox__dot${i === index ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); setIndex(i) }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

function renderBlock(block, index, openLightbox) {
  switch (block.type) {
    case 'heading':
      return <h2 key={index} className="panel-h2">{block.content}</h2>

    case 'statement':
      return <p key={index} className="panel-statement">{block.content}</p>

    case 'paragraph':
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: block.content }} />
      )

    case 'list':
      return (
        <ul key={index}>
          {block.content.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )

    case 'pdf':
      return block.src
        ? (
          <figure key={index} className="pdf-viewer" data-no-cursor>
            <iframe src={`${block.src}#zoom=60`} title={block.label ?? 'PDF document'} />
            {block.label && <figcaption>{block.label}</figcaption>}
          </figure>
        )
        : (
          <figure key={index} className="pdf-placeholder-wrap">
            <div className="pdf-placeholder">
              <div className="pdf-placeholder__icon" aria-hidden="true">
                <svg width="28" height="32" viewBox="0 0 28 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 1h14l9 9v21H4V1z" />
                  <path d="M18 1v9h9" />
                  <line x1="8" y1="16" x2="20" y2="16" />
                  <line x1="8" y1="21" x2="20" y2="21" />
                  <line x1="8" y1="26" x2="14" y2="26" />
                </svg>
              </div>
            </div>
            {block.label && <figcaption>{block.label}</figcaption>}
          </figure>
        )

    case 'video':
      if (!block.src) return (
        <div key={index} className="video-placeholder">
          <div className="video-placeholder__icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span>Video coming soon</span>
        </div>
      )
      return block.src.startsWith('http')
        ? (
          <figure key={index} className="media media--video">
            <div className="video-embed">
              <iframe src={block.src} title={block.alt ?? 'Video'} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        )
        : (
          <figure key={index} className="media media--video">
            <video controls preload="metadata" style={{ width: '100%', borderRadius: '8px', display: 'block' }}>
              <source src={block.src} type="video/mp4" />
            </video>
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        )

    case 'process-flow':
      return (
        <div key={index} className="process-flow">
          <div className="process-flow__steps">
            {block.steps.map((step, i) => (
              <div
                key={i}
                className="process-flow__step"
                style={{ background: step.color, color: step.textColor ?? '#fff' }}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>
      )

    case 'embed':
      return <EmbedFrame key={index} src={block.src} label={block.label} />

    case 'screen-viewer':
      return <MiCasaScreenViewer key={index} screens={micasaScreens} />

    case 'gallery':
      return (
        <div key={index} className={`media-gallery${block.layout === 'columns' ? ' media-gallery--columns' : ''}`}>
          {block.images.map((img, i) => (
            <figure
              key={i}
              className="media-gallery__item media-gallery__item--zoomable"
              onClick={() => openLightbox(block.images, i)}
            >
              <img src={img.src} alt={img.alt ?? ''} loading="lazy" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )

    case 'media':
      return block.src
        ? (
          <figure key={index} className="media media--img">
            <img
              src={block.src}
              alt={block.alt ?? ''}
              loading="lazy"
              style={block.maxHeight ? { maxHeight: block.maxHeight, width: '100%', objectFit: 'contain' } : undefined}
            />
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        )
        : (
          <figure key={index} className="media-placeholder-wrap">
            <div className="media">
              <span>{block.content}</span>
            </div>
            {block.caption && <figcaption className="media-placeholder-caption">{block.caption}</figcaption>}
          </figure>
        )

    default:
      return null
  }
}

export default function ProjectPanel({ body, links }) {
  const [lightbox, setLightbox] = useState(null)

  const openLightbox = useCallback((images, startIndex) => {
    setLightbox({ images, startIndex })
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <motion.div
      className="panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
    >
      {body.map((block, i) => renderBlock(block, i, openLightbox))}

      {links?.length > 0 && (
        <div className="panel-links">
          {links.map(link => (
            <Link
              key={link.label}
              to={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`link-btn${link.primary ? ' primary' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          onClose={closeLightbox}
        />
      )}
    </motion.div>
  )
}
