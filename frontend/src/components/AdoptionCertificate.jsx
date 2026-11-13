import { useState, useEffect } from 'react'

export default function AdoptionCertificate({ artifactId, artifactName }) {
  const [adopterName, setAdopterName] = useState(null)
  const [inputName, setInputName] = useState('')

  // On mount, check if this artifact has already been adopted.
  useEffect(() => {
    const saved = localStorage.getItem(`adopted_${artifactId}`)
    if (saved) setAdopterName(saved)
  }, [artifactId])

  const handleAdopt = (e) => {
    e.preventDefault()
    if (!inputName.trim()) return

    // Save to localStorage
    localStorage.setItem(`adopted_${artifactId}`, inputName.trim())
    setAdopterName(inputName.trim())
  }

  // If the artifact is already adopted, show the certificate.
  if (adopterName) {
    return (
      <div className="mt-12 rounded-xl border-2 border-yellow-500/30 bg-slate-900 p-8 text-center">
        <p className="text-sm text-yellow-500 uppercase tracking-widest font-semibold">Certificate of Adoption</p>
        <h2 className="text-2xl font-bold mt-4">This certifies that</h2>
        <p className="text-4xl font-serif italic text-white mt-2">{adopterName}</p>
        <h2 className="text-xl mt-4">has officially adopted</h2>
        <p className="text-3xl font-bold text-yellow-400 mt-2">{artifactName}</p>
        <p className="text-slate-400 mt-8 text-sm">
          Thank you for keeping its memory alive.
        </p>
      </div>
    )
  }

  // If not adopted, show the form.
  return (
    <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold">Adopt {artifactName}</h3>
      <p className="text-sm text-slate-400 mt-1 mb-4">
        Enter your name to generate an official certificate of adoption.
      </p>
      <form onSubmit={handleAdopt} className="flex gap-3">
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Your name"
          className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!inputName.trim()}
          className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-slate-950 hover:bg-yellow-400 disabled:opacity-50 transition"
        >
          Adopt
        </button>
      </form>
    </div>
  )
}