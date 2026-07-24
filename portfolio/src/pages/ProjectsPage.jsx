import Header from '../components/layout/Header.jsx'
import PageIntro from '../components/sections/PageIntro.jsx'
import CategoryGroup from '../components/sections/CategoryGroup.jsx'
import { categories, projects, projectsByCategory } from '../data/index.js'

export default function ProjectsPage() {
  return (
    <>
      <h1 className="sr-only">Projects</h1>
      <Header />
      <main className="wrap projects-main">
        <PageIntro count={projects.length} />
        {categories.map((cat, i) => (
          <div key={cat.id}>
            <CategoryGroup category={cat} projects={projectsByCategory(cat.id)} />
            {i < categories.length - 1 && <div className="section-gap" />}
          </div>
        ))}
      </main>
    </>
  )
}
