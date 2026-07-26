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
          {block.content.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )

    case 'media':
      return (
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
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
