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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Abandoned but Not Forgotten
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl text-lg">
          Four pieces of NASA hardware are still out there. Pick one and hear
          its story in its own words.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {loading && <p className="text-slate-400">Loading artifacts…</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artifacts.map((a) => (
              // NEW: Wrap the whole card in a Link to the detail page
              <Link 
                key={a.artifact_id} 
                to={`/artifact/${a.artifact_id}`}
                className="block rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 transition">
                <h2 className="text-xl font-semibold">{a.name}</h2>
                <p className="text-sm text-slate-400 mt-1">{a.blurb}</p>
                <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm">
                  <dt className="text-slate-500">Launch</dt>
                  <dd>{a.launch_date}</dd>
                  <dt className="text-slate-500">Duration</dt>
                  <dd>{a.mission_duration}</dd>
                  <dt className="text-slate-500">Location</dt>
                  <dd>{a.location}</dd>
                </dl>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}