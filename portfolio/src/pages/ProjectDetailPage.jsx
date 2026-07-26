import { useParams, Navigate } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import ProjectHeader from '../components/sections/ProjectHeader.jsx'
import ProjectPanel from '../components/sections/ProjectPanel.jsx'
import ProjectNav from '../components/ui/ProjectNav.jsx'
import { projectDetails } from '../data/projectDetails.js'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const project = projectDetails[id]

  if (!project) return <Navigate to="/projects" replace />

  return (
    <>
      <Header />
      <main className="wrap">
        <article className="detail" aria-labelledby="project-title">
          <ProjectHeader project={project} />
          <ProjectPanel body={project.body} links={project.links} />
          <ProjectNav prev={project.prev} next={project.next} />
        </article>
      </main>
    </>
  )
}
