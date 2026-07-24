import { motion } from 'framer-motion'
import ProjectCard from '../ui/ProjectCard.jsx'
import { cardContainer } from '../../animations/variants.js'

function CategoryTitle({ title, hasDivider }) {
  if (!hasDivider) return <h2 className="category-title">{title}</h2>

  const parts = title.split('|')
  return (
    <h2 className="category-title">
      {parts[0].trim()}
      <span className="divider" aria-hidden="true"> | </span>
      {parts[1].trim()}
    </h2>
  )
}

export default function CategoryGroup({ category, projects }) {
  return (
    <section className="category" id={category.id}>
      <CategoryTitle title={category.title} hasDivider={category.hasDivider} />
      <motion.div
        variants={cardContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </section>
  )
}
