import { useState, useEffect } from 'react'
import Header from '../components/layout/Header.jsx'
import Hero from '../components/sections/Hero.jsx'
import NavBlocks from '../components/sections/NavBlocks.jsx'

export default function HomePage() {
  const [bt, setBt] = useState({ B: null, T: null })

  // Sync B → body background, T → body text color.
  // Play-box stays white and uses its own color overrides via CSS.
  useEffect(() => {
    document.body.style.backgroundColor = bt.B || ''
    return () => { document.body.style.backgroundColor = '' }
  }, [bt.B])

  // Override --ink on the root so every element using color:var(--ink)
  // picks up the T color. body.style.color only reaches elements that
  // inherit; CSS-variable override reaches everything that declares it.
  useEffect(() => {
    const root = document.documentElement
    if (bt.T) {
      root.style.setProperty('--ink',      bt.T)
      root.style.setProperty('--ink-soft', bt.T)
      root.style.setProperty('--primary',  bt.T)
    } else {
      root.style.removeProperty('--ink')
      root.style.removeProperty('--ink-soft')
      root.style.removeProperty('--primary')
    }
    return () => {
      root.style.removeProperty('--ink')
      root.style.removeProperty('--ink-soft')
      root.style.removeProperty('--primary')
    }
  }, [bt.T])

  return (
    <>
      <Header />
      <main className="wrap main--home">
        <Hero bt={bt} setBt={setBt} />
        <NavBlocks bt={bt} />
      </main>
    </>
  )
}
