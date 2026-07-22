import { projects } from '../data.js'

export default function Projects() {
  return (
    <section className="section wrap" id="work">
      <div className="section-head reveal">
        <span className="section-num">02</span>
        <h2>Selected projects</h2>
      </div>

      <div className="proj">
        {projects.map((p) => (
          <article className="proj-row reveal" key={p.id}>
            <span className="pid">{p.id}</span>
            <div>
              <h3>{p.title}</h3>
              <div className="cat">{p.category}</div>
              <p>{p.summary}</p>
            </div>
            <span className="yr">{p.year}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
