import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ChatWidget from '../components/ChatWidget' 

export default function ArtifactDetailPage() {
  const { artifact_id } = useParams() // gets "spirit" from the URL
  const [artifact, setArtifact] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch both the artifact metadata and its questions in parallel
    Promise.all([
      fetch('/api/artifacts').then(r => r.json()),
      fetch('/api/questions').then(r => r.json())
    ]).then(([artifactsData, questionsData]) => {
      // Find the specific artifact this URL is asking for
      const found = artifactsData.artifacts.find(a => a.artifact_id === artifact_id)
      setArtifact(found)
      setQuestions(questionsData.artifacts[artifact_id] || [])
      setLoading(false)
    })
  }, [artifact_id]) // Re-run if the user navigates directly to another artifact URL

  if (loading) return <div className="p-10 text-white">Loading…</div>
  if (!artifact) return <div className="p-10 text-white">Artifact not found.</div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <header className="max-w-3xl mx-auto px-6 pt-10">
        <Link to="/" className="text-sm text-blue-400 hover:text-blue-300">
          &larr; Back to artifacts
        </Link>
        <h1 className="text-4xl font-bold mt-4">{artifact.name}</h1>
        <p className="text-slate-300 mt-2">{artifact.blurb}</p>
        
        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-6 text-sm">
          <div>
            <dt className="text-slate-500">Launched</dt>
            <dd className="font-medium">{artifact.launch_date}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Mission Duration</dt>
            <dd className="font-medium">{artifact.mission_duration}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Current Location</dt>
            <dd className="font-medium">{artifact.location}</dd>
          </div>
        </dl>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-10">
        {/* The ChatWidget gets the artifact id and the pre-fetched questions */}
        <ChatWidget artifactId={artifact_id} artifactName={artifact.name} questions={questions} />
      </main>
    </div>
  )
}