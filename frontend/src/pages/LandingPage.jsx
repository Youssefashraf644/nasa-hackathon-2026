import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom' // NEW

export default function LandingPage() {
  const [artifacts, setArtifacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/artifacts')
      .then((r) => r.json())
      .then((data) => setArtifacts(data.artifacts))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen text-slate-100">
      <header className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Abandoned but <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Not Forgotten</span>
        </h1>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg md:text-xl">
          Four pieces of NASA hardware are still out there. Pick one and hear its story in its own words.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {loading && <p className="text-center text-slate-400 animate-pulse">Initializing connection...</p>}
        {error && <p className="text-center text-red-400">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {artifacts.map((a) => (
              <Link 
                key={a.artifact_id} 
                to={`/artifact/${a.artifact_id}`}
                className="group relative block rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
              >
                <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{a.name}</h2>
                <p className="text-sm text-slate-400 mt-2">{a.blurb}</p>
                
                <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm border-t border-white/5 pt-4">
                  <dt className="text-slate-500">Launch</dt>
                  <dd className="text-slate-300">{a.launch_date}</dd>
                  <dt className="text-slate-500">Duration</dt>
                  <dd className="text-slate-300">{a.mission_duration}</dd>
                  <dt className="text-slate-500">Location</dt>
                  <dd className="text-slate-300">{a.location}</dd>
                </dl>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}