import { motion } from 'framer-motion'
import BackButton from '../ui/BackButton.jsx'

export default function ProjectHeader({ project }) {
  const { category, title, company, role, dateStart, dateEnd, tags } = project

  const categoryLabel = category.hasDivider
    ? category.title.split('|').map((part, i, arr) => (
        <span key={i}>
          {part.trim()}
          {i < arr.length - 1 && <span className="divider" aria-hidden="true"> | </span>}
        </span>
      ))
    : category.title

  return (
    <motion.div
      className="detail-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {/* Hidden h1 for accessibility / SEO */}
      <h1 className="sr-only">{title}</h1>

      <BackButton to="/projects" label="Back to projects" />

      <div className="detail-eyebrow">{categoryLabel}</div>

      <dl className="detail-meta">
        <div className="detail-meta-row">
          <dt>Role</dt>
          <dd>{role}</dd>
        </div>
        <div className="detail-meta-row">
          <dt>Company</dt>
          <dd>{company}</dd>
        </div>
        <div className="detail-meta-row">
          <dt>Project</dt>
          <dd>{title}</dd>
        </div>
        <div className="detail-meta-row">
          <dt>Duration</dt>
          <dd>{dateStart} – {dateEnd}</dd>
        </div>
      </dl>

      <div className="tags detail-tags">
        {tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </motion.div>
  )
}
