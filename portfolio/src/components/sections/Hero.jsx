import HeroText from '../ui/HeroText.jsx'
import PlayBox from '../ui/PlayBox.jsx'

export default function Hero({ bt, setBt }) {
  return (
    <section className="hero">
      <HeroText />
      <PlayBox bt={bt} setBt={setBt} />
    </section>
  )
}
