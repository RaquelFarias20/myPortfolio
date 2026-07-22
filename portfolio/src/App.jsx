import { useEffect } from 'react'
import { profile } from './data.js'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Awards from './components/Awards.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // Reveals .reveal elements on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div className="topbar">
        <a className="mark" href="#top">RFG</a>
        <nav>
          <a href="#about">About</a>
          <a href="#work">Projects</a>
          <a href="#awards">Awards</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <main id="top">
        <Hero />
        <About />
        <Projects />
        <Awards />
        <Footer />
      </main>
    </>
  )
}
