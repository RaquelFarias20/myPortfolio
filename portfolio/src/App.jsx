import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import CustomCursor from './components/ui/CustomCursor.jsx'
import { useLenis } from './hooks/useLenis.js'

export default function App() {
  useLenis()

  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </>
  )
}
