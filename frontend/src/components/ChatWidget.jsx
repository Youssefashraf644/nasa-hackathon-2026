// frontend/src/components/ChatWidget.jsx
import { useState } from 'react'

export default function ChatWidget({ artifactId, artifactName, questions }) {
  // messages holds the conversation history for the UI
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi, I'm ${artifactName}. What do you want to know?` }
  ])
  
  // isSending disables chips and shows a "thinking" state
  const [isSending, setIsSending] = useState(false)
  
  const [sessionId, setSessionId] = useState(null)

  const handleChipClick = async (questionId) => {
    if (isSending) return // guard against double-clicks

    // 1. Append the user's choice immediately so the UI feels responsive
    const selectedQuestion = questions.find(q => q.question_id === questionId)
    setMessages(prev => [...prev, { role: 'user', text: selectedQuestion.label }])
    setIsSending(true)

    try {
      // 2. Send the request to Flask
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifact_id: artifactId,
          question_id: questionId,
          session_id: sessionId // will be null on first request, backend handles it
        })
      })
      
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()

      // 3. Save the session ID so the next click remembers the conversation
      if (data.session_id) setSessionId(data.session_id)

      // 4. Append the AI's reply
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "My connection to Earth failed. Try again!" }])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col h-[600px]">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                <span>{artifactName} is thinking</span>
                <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
            </div>
          </div>
        )}
      </div>

      {/* Question Chips */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Ask a question</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q) => (
            <button
              key={q.question_id}
              onClick={() => handleChipClick(q.question_id)}
              disabled={isSending}
              className="px-3 py-1.5 rounded-full bg-slate-800 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}