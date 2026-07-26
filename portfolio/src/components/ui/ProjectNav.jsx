import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ProjectNav({ prev, next }) {
  if (!prev && !next) return null

  return (
    <motion.nav
      className="project-nav"
      aria-label="Project navigation"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.16 }}
    >
      <div>
        {prev && (
          <Link to={`/projects/${prev.id}`} className="pn-link">
            <div className="pn-label">← Previous</div>
            <div className="pn-title">{prev.title}</div>
          </Link>
        )}
      </div>
      <div className="pn-right">
        {next && (
          <Link to={`/projects/${next.id}`} className="pn-link pn-link--right">
            <div className="pn-label">Next →</div>
            <div className="pn-title">{next.title}</div>
          </Link>
        )}
      </div>
    </motion.nav>
  )
}
