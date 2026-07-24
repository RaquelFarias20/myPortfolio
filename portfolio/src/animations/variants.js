export const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const heroText = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export const navContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}

export const navItem = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Projects page — stagger container per category
export const cardContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

// Card entrance: fade + 16px rise
export const cardItem = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
