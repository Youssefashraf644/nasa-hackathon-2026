import { useRef, useState } from 'react'

// 1. Point to the files in the public/videos/ folder
const VIDEOS = [
  {
    id: 'v1',
    title: 'The Story of Sojourner',
    description: 'How the first wheeled rover changed Mars exploration forever.',
    videoUrl: '/videos/sojourner.mp4', 
  },
  {
    id: 'v2',
    title: 'Spirit & Opportunity: The Twins',
    description: 'The incredible journey of the rovers that were supposed to last 90 days.',
    videoUrl: '/videos/spirit.mp4',
  },
  {
    id: 'v3',
    title: 'Apollo 11: The Eagle Has Landed',
    description: 'Relive the moment humans first stepped onto the Moon.',
    videoUrl: '/videos/eagle.mp4',
  },
  {
    id: 'v4',
    title: 'Why We Leave Robots Behind',
    description: 'The engineering and science behind abandoning our hardware in space.',
    videoUrl: '/videos/space.mp4',
  },
  {
    id: 'v5',
    title: 'The Future of Mars Exploration',
    description: 'What comes next after Perseverance and Curiosity?',
    videoUrl: '/videos/astronaut.mp4',
  },
]

export default function SeriesPage() {
  const [playingId, setPlayingId] = useState(null)
  const videoRefs = useRef({}) // To control pause/play across multiple videos

  const handlePlay = (id) => {
    // If another video is playing, pause it
    if (playingId && playingId !== id && videoRefs.current[playingId]) {
      videoRefs.current[playingId].pause()
    }
    setPlayingId(id)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-100">
      <h1 className="text-3xl font-bold mb-2">Mission Series</h1>
      <p className="text-slate-400 mb-8">Watch the stories of the hardware we left behind.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VIDEOS.map((video) => (
          <div 
            key={video.id} 
            className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col"
          >
            <div className="aspect-video bg-slate-950 relative">
              <video
                ref={(el) => (videoRefs.current[video.id] = el)}
                src={video.videoUrl}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
                onPlay={() => handlePlay(video.id)}
              />
            </div>

            <div className="p-4 flex-1">
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}