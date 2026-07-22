import Header from './components/layout/Header.jsx'
import Hero from './components/sections/Hero.jsx'
import NavBlocks from './components/sections/NavBlocks.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main className="wrap">
        <Hero />
        <NavBlocks />
      </main>
      {/* Anchor targets — sections not yet designed */}
      <section id="about"        style={{ scrollMarginTop: '80px' }} />
      <section id="projects"     style={{ scrollMarginTop: '80px' }} />
      <section id="illustration" style={{ scrollMarginTop: '80px' }} />
      <section id="photography"  style={{ scrollMarginTop: '80px' }} />
      <section id="contact"      style={{ scrollMarginTop: '80px' }} />
    </>
  )
}
