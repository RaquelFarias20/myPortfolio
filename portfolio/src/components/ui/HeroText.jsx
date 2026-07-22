import { motion } from 'framer-motion'
import { profile } from '../../data/index.js'
import { heroText } from '../../animations/variants.js'

export default function HeroText() {
  return (
    <div>
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={heroText}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <span className="greeting">{profile.greeting}</span>
        <span className="accent">{profile.role}</span>
      </motion.h1>

      <motion.p
        className="specialties"
        initial="hidden"
        animate="visible"
        variants={heroText}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        {profile.specialties}
      </motion.p>
    </div>
  )
}
