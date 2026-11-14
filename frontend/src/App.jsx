import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ArtifactDetailPage from './pages/ArtifactDetailPage'

const SeriesPage = () => <div className="p-10 text-white max-w-5xl mx-auto"><h1 className="text-3xl font-bold">Mission Series</h1><p className="text-slate-400 mt-2">Coming soon...</p></div>
const StoriesPage = () => <div className="p-10 text-white max-w-5xl mx-auto"><h1 className="text-3xl font-bold">Stories</h1><p className="text-slate-400 mt-2">Coming soon...</p></div>
const ImagesPage = () => <div className="p-10 text-white max-w-5xl mx-auto"><h1 className="text-3xl font-bold">Image Gallery</h1><p className="text-slate-400 mt-2">Coming soon...</p></div>

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
    </Routes>
    </div>
  )
}

export default App