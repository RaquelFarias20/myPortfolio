import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { navItem } from '../../animations/variants.js'

const MotionLink = motion(Link)

export default function NavBlock({ id, value, label, href }) {
  return (
    <MotionLink className={`stat stat--${id}`} to={href} variants={navItem}>
      <div className="num">{value}</div>
      <div className="label">{label}</div>
    </MotionLink>
  )
}
