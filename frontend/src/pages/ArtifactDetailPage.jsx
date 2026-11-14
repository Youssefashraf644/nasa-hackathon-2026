import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ChatWidget from '../components/ChatWidget' 
import AdoptionCertificate from '../components/AdoptionCertificate'

export default function ArtifactDetailPage() {
  const { artifact_id } = useParams() // gets "spirit" from the URL
  const [artifact, setArtifact] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch both the artifact metadata and its questions in parallel
    Promise.all([
      fetch('/api/artifacts').then(r => {
        if (!r.ok) throw new Error("Failed to load artifacts")
        return r.json()
      }),
      fetch('/api/questions').then(r => {
        if (!r.ok) throw new Error("Failed to load questions")
        return  r.json()
      })
    ]).then(([artifactsData, questionsData]) => {
      // Find the specific artifact this URL is asking for
      const found = artifactsData.artifacts.find(a => a.artifact_id === artifact_id)
      setArtifact(found)
      setQuestions(questionsData.artifacts[artifact_id] || [])
      setLoading(false)
    })
  }, [artifact_id]) // Re-run if the user navigates directly to another artifact URL

  if (loading) return <div className="p-10 text-white">Loading…</div>
  if (error) return <div className="p-10 text-red-400">Error: {error}. Run the back end</div>
  if (!artifact) return <div className="p-10 text-white">Artifact not found.</div>

  return (
    <div className="min-h-screen pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 border-b border-white/10">
        <Link to="/" className="text-sm text-blue-400 hover:text-blue-300 mb-6 inline-block transition-colors">
          &larr; Back to artifacts
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2">{artifact.name}</h1>
        <p className="text-lg text-slate-400 mt-3">{artifact.blurb}</p>
        
        <dl className="mt-8 grid grid-cols-3 gap-6 text-sm">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <dt className="text-slate-500 uppercase tracking-wider text-xs mb-1">Launched</dt>
            <dd className="font-medium text-slate-200">{artifact.launch_date}</dd>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <dt className="text-slate-500 uppercase tracking-wider text-xs mb-1">Mission Duration</dt>
            <dd className="font-medium text-slate-200">{artifact.mission_duration}</dd>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <dt className="text-slate-500 uppercase tracking-wider text-xs mb-1">Current Location</dt>
            <dd className="font-medium text-slate-200">{artifact.location}</dd>
          </div>
        </dl>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10">
        <ChatWidget artifactId={artifact_id} artifactName={artifact.name} questions={questions} />
        <AdoptionCertificate artifactId={artifact_id} artifactName={artifact.name} />
      </main>
    </div>
  )
}