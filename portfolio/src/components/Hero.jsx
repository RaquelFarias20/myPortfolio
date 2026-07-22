import { profile } from '../data.js'

export default function Hero() {
  return (
    <header className="hero wrap">
      <div className="hero-meta reveal">
        <span>Portfolio / <b>2026</b></span>
        <span>Based in <b>{profile.location}</b></span>
      </div>

      <h1 className="reveal">
        {profile.role}<br />
        <span className="accent">{profile.focus}</span>
      </h1>

      {/* Dimension line: signature element, a nod to technical drawing */}
      <div className="dimline reveal" aria-hidden="true">
        <span className="tick" />
        <span className="rule" />
        <span className="label">{profile.name}</span>
        <span className="rule" />
        <span className="tick" />
      </div>

      <p className="intro reveal">{profile.intro}</p>

      <div className="hero-actions reveal">
        <a className="btn btn-primary" href="#work">View projects</a>
        <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
      </div>
    </header>
  )
}
