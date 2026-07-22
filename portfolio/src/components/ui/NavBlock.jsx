import { motion } from 'framer-motion'
import { navItem } from '../../animations/variants.js'

export default function NavBlock({ id, value, label }) {
  return (
    <motion.a className="stat" href={`#${id}`} variants={navItem}>
      <div className="num">{value}</div>
      <div className="label">{label}</div>
    </motion.a>
  )
}
