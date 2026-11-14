import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    // 1. Get all keys from localStorage
    const keys = Object.keys(localStorage)
    
    // 2. Filter for our adoption keys
    const adoptedKeys = keys.filter(key => key.startsWith('adopted_'))
    
    // 3. Map them to objects we can render
    const certs = adoptedKeys.map(key => {
      const artifactId = key.replace('adopted_', '')
      const adopterName = localStorage.getItem(key)
      return { artifactId, adopterName }
    })
    
    setCertificates(certs)
  }, []) // Empty dependency array = runs once on mount

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Your Certificates</h1>
      <p className="text-slate-400 mb-8">You are the proud adopter of these pieces of space history.</p>

      {certificates.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">You haven't adopted any artifacts yet.</p>
          <Link to="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
            Go to the artifacts &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.artifactId} className="rounded-xl border-2 border-yellow-500/30 bg-slate-900 p-8 text-center">
              <p className="text-sm text-yellow-500 uppercase tracking-widest font-semibold">Certificate of Adoption</p>
              <h2 className="text-xl font-bold mt-4 text-white">This certifies that</h2>
              <p className="text-3xl font-serif italic text-white mt-1">{cert.adopterName}</p>
              <h2 className="text-lg mt-3 text-slate-300">has officially adopted</h2>
              <p className="text-2xl font-bold text-yellow-400 mt-1 capitalize">{cert.artifactId}</p>
              
              {/* Link back to the artifact page to chat with it again */}
              <Link 
                to={`/artifact/${cert.artifactId}`}
                className="inline-block mt-6 text-sm text-blue-400 hover:text-blue-300"
              >
                Visit {cert.artifactId}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}