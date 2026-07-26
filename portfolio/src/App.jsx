import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'
import CustomCursor from './components/ui/CustomCursor.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import { useLenis } from './hooks/useLenis.js'

export default function App() {
  useLenis()

  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/projects"      element={<ProjectsPage />} />
        <Route path="/projects/:id"  element={<ProjectDetailPage />} />
      </Routes>
    </>
  )
}
