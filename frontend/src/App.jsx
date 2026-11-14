import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ArtifactDetailPage from './pages/ArtifactDetailPage'
import CertificatesPage from './pages/CertificatesPage'
import SeriesPage from './pages/SeriesPage'
import ImagesPage from './pages/ImagesPage'
import StoriesPage from './pages/StoriesPage'




function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* The Navbar sits outside the Routes so it's always visible */}
      <Navbar />
      
    <Routes>
      {/* The landing page shows the cards */}
      <Route path="/" element={<LandingPage />} />
      
      {/* The detail page reads the :artifact_id from the URL */}
      <Route path="/artifact/:artifact_id" element={<ArtifactDetailPage />} />
      <Route path="/series" element={<SeriesPage />} />
      <Route path="/stories" element={<StoriesPage />} />
      <Route path="/images" element={<ImagesPage />} />
      <Route path="/certificates" element={<CertificatesPage />} />
    </Routes>
    </div>
  )
}

export default App