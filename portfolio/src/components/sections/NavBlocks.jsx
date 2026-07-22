import { motion } from 'framer-motion'
import NavBlock from '../ui/NavBlock.jsx'
import { navBlocks } from '../../data/index.js'
import { navContainer } from '../../animations/variants.js'

export default function NavBlocks() {
  return (
    <motion.nav
      className="stats"
      aria-label="Primary"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={navContainer}
    >
      {navBlocks.map(block => (
        <NavBlock key={block.id} {...block} />
      ))}
    </motion.nav>
  )
}
