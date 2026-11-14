import { useState } from 'react'

export default function ChatWidget({ artifactId, artifactName, questions }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `System online. I am ${artifactName}. What do you want to know?` }
  ])
  const [isSending, setIsSending] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const handleChipClick = async (questionId) => {
    if (isSending) return

    const selectedQuestion = questions.find(q => q.question_id === questionId)
    setMessages(prev => [...prev, { role: 'user', text: selectedQuestion.label }])
    setIsSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifact_id: artifactId,
          question_id: questionId,
          session_id: sessionId
        })
      })
      
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      if (data.session_id) setSessionId(data.session_id)

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Connection to Earth failed. Please try again." }])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden flex flex-col h-[600px] shadow-2xl">
      {/* Header */}
      <div className="bg-slate-950/80 px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-mono text-slate-300 tracking-widest uppercase">{artifactName} UPLINK</span>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm md:text-base leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-800/80 text-slate-200 border border-slate-700 rounded-bl-none font-mono'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 text-slate-400 rounded-2xl rounded-bl-none px-5 py-4 text-sm flex items-center gap-2 border border-slate-700">
              <span className="font-mono text-xs">RECEIVING DATA</span>
              <span className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Question Chips */}
      <div className="p-5 bg-slate-950/60 border-t border-white/5">
        <p className="text-xs text-slate-500 mb-3 font-mono tracking-widest uppercase">Select transmission</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q) => (
            <button
              key={q.question_id}
              onClick={() => handleChipClick(q.question_id)}
              disabled={isSending}
              className="px-4 py-2 rounded-full bg-slate-800 text-sm text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}