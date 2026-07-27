import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function renderBlock(block, index) {
  switch (block.type) {
    case 'heading':
      return <h2 key={index} className="panel-h2">{block.content}</h2>

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
          <div key={index} className="pdf-viewer">
            <iframe src={block.src} title={block.title ?? 'PDF document'} />
          </div>
        )
        : (
          <div key={index} className="pdf-placeholder">
            <div className="pdf-placeholder__icon" aria-hidden="true">
              <svg width="28" height="32" viewBox="0 0 28 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 1h14l9 9v21H4V1z" />
                <path d="M18 1v9h9" />
                <line x1="8" y1="16" x2="20" y2="16" />
                <line x1="8" y1="21" x2="20" y2="21" />
                <line x1="8" y1="26" x2="14" y2="26" />
              </svg>
            </div>
            <span>{block.label ?? 'PDF coming soon'}</span>
          </div>
        )

    case 'video':
      return (
        <div key={index} className="video-placeholder">
          <div className="video-placeholder__icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span>Video coming soon</span>
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
          <div key={index} className="media">
            <span>{block.content}</span>
          </div>
        )

    default:
      return null
  }
}

export default function ProjectPanel({ body, links }) {
  return (
    <motion.div
      className="panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
    >
      {body.map((block, i) => renderBlock(block, i))}

      {links?.length > 0 && (
        <div className="panel-links">
          {links.map(link => (
            <Link
              key={link.label}
              to={link.href}
              className={`link-btn${link.primary ? ' primary' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  )
}
