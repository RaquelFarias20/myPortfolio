import { profile } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer wrap" id="contact">
      <span className="eyebrow reveal">04 — Contacto</span>
      <h2 className="reveal" style={{ marginTop: '20px' }}>
        ¿Trabajamos<br />
        <a href={`mailto:${profile.email}`}>juntas?</a>
      </h2>

      <div className="footer-links reveal">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
      </div>

      <div className="footer-base">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Hecho con React — desplegado en Vercel</span>
      </div>
    </footer>
  )
}
