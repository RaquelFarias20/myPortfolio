import BackButton from '../ui/BackButton.jsx'

export default function PageIntro({ count }) {
  return (
    <section className="intro">
      <BackButton to="/" label="Back to home" />
      <div className="count">{count}</div>
      <div className="count-label">Projects</div>
    </section>
  )
}
