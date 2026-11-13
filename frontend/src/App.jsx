import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ArtifactDetailPage from './pages/ArtifactDetailPage'

function App() {
  return (
    <Routes>
      {/* The landing page shows the cards */}
      <Route path="/" element={<LandingPage />} />
      
      {/* The detail page reads the :artifact_id from the URL */}
      <Route path="/artifact/:artifact_id" element={<ArtifactDetailPage />} />
    </Routes>
  )
}

export default App