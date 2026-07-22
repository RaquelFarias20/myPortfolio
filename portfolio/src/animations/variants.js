// Scroll-reveal: used with Framer Motion whileInView
export const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// Mount animation: used for above-fold hero text
export const heroText = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

// Stagger container for nav blocks
export const navContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}

// Child item for staggered nav
export const navItem = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
