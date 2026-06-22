import { awards, certifications } from '../data.js'

export default function Awards() {
  return (
    <section className="section wrap" id="awards">
      <div className="section-head reveal">
        <span className="section-num">03</span>
        <h2>Premios y reconocimientos</h2>
      </div>

      <div className="spec">
        {awards.map((a, i) => (
          <div className="spec-row reveal" key={i}>
            <span className="yr">{a.year}</span>
            <div>
              <h4>{a.title}</h4>
              {a.detail && <p>{a.detail}</p>}
            </div>
          </div>
        ))}
      </div>

      {certifications.map((c, i) => (
        <div className="cert-strip reveal" key={i}>
          <span className="yr">{c.year}</span>
          <span className="t">{c.title}</span>
          <span className="badge">{c.status}</span>
        </div>
      ))}
    </section>
  )
}
