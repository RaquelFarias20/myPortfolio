import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cardItem } from '../../animations/variants.js'

export default function ProjectCard({ project }) {
  const { role, company, description, tags, href } = project

  return (
    <motion.article className="card" variants={cardItem} aria-label={role}>
      <div className="card-left">
        <div className="field">
          <div className="field-label">Role</div>
          <div className="field-value">{role}</div>
        </div>
        <div className="field">
          <p className="desc">{description}</p>
        </div>
      </div>

      <div className="card-right">
        <div className="field">
          <div className="field-label">Company</div>
          <div className="field-value">{company}</div>
        </div>
        <div className="tags" aria-label="Tags">
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        {href ? (
          <Link to={href} className="view">
            <span className="view-inner">View ›</span>
          </Link>
        ) : (
          <span className="view view--disabled" aria-hidden="true">
            <span className="view-inner">Coming soon</span>
          </span>
        )}
      </div>
    </motion.article>
  )
}
