import Header from '../components/layout/Header.jsx'
import Hero from '../components/sections/Hero.jsx'
import NavBlocks from '../components/sections/NavBlocks.jsx'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="wrap main--home">
        <Hero />
        <NavBlocks />
      </main>
    </>
  )
}
