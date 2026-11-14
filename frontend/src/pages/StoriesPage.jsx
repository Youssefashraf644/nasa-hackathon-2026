import { useState } from 'react'

const STORIES = [
    {
      id: 'sojourner',
      title: 'The Microwave That Bounced',
      artifact: 'Sojourner',
      color: 'border-blue-500/30',
      preview: 'A tiny rover, a giant airbag, and fifteen bounces across Mars.',
      text: `We hit the Martian atmosphere at 14,000 miles per hour. There was no retro-rocket to slow us down—just a parachute, and then a cocoon of giant airbags. I bounced. Not once, not twice, but about fifteen times across the rocky plains of Ares Vallis, soaring as high as a three-story building before finally rolling to a stop. I was tiny—just 23 pounds, about the size of a microwave oven. But when my six wheels touched the red dirt, I became the first rover ever to roll on another planet. I wasn't built to last long; my mission was planned for just seven days. I lasted 83. I was the trailblazer, the little machine that proved Mars was once warm and wet. And I did it all while looking a bit like a remote-controlled car.`,
    },
    {
      id: 'spirit',
      title: 'The Broken Wheel That Found a Miracle',
      artifact: 'Spirit',
      color: 'border-blue-500/30',
      preview: 'A jammed wheel dragged through the dirt uncovers ancient hot springs.',
      text: `In 2006, my right front wheel stopped working. It was a disaster—or so we thought. I had to drag that dead wheel behind me like a broken leg. But Mars has a strange sense of humor. As I limped toward a hill called Home Plate, that stuck wheel scraped through the soft soil, churning up something white and bright. I analyzed it and found almost pure silica—a mineral that on Earth only forms in hot springs or steamy volcanic vents, the kind of places teeming with microbial life. My broken wheel had uncovered a habitable environment from Mars's ancient past. I was designed for 90 days. I survived for six years. Even when I got stuck in a sandpit in 2009 and couldn't move anymore, I kept listening to the wind and sending data home until the very end.`,
    },
    {
      id: 'opportunity',
      title: 'The Marathon Runner',
      artifact: 'Opportunity',
      color: 'border-blue-500/30',
      preview: 'A 90-day mission that turned into a 15-year marathon across Mars.',
      text: `My twin sister Spirit and I landed on opposite sides of Mars in January 2004. Everyone expected us to last 90 days. I lasted nearly 15 years. I drove 28 miles across the red planet—the longest distance any robot has ever traveled on another world. I found "blueberries"—tiny hematite spheres that formed in ancient acidic groundwater. I found gypsum veins, proof that water once flowed through underground fractures. I survived dust storms that blocked out the sun for weeks. But in 2018, a storm came that was too big, too dark, and too long. I sent my last message on June 10, 2018. I went silent in a valley called Perseverance. I didn't know it yet, but I was naming the future.`,
    },
    {
      id: 'eagle',
      title: '25 Seconds',
      artifact: 'Eagle',
      color: 'border-blue-500/30',
      preview: 'A tense descent to the Moon with less than 30 seconds of fuel left.',
      text: `I was the lunar module that carried Neil Armstrong and Buzz Aldrin to the surface of the Moon. On July 20, 1969, as we descended, the computer started flashing alarms. We were running long. We were heading straight for a boulder-strewn crater the size of a football field. Armstrong took manual control. He leveled me out and flew me horizontally across the black sky, searching for a flat spot. When my footpads finally touched the lunar dust, we had less than 25 seconds of fuel left. If we had been 25 seconds later, we would have had to abort. I am the descent stage. My upper half—the ascent stage—left to carry the astronauts home. I stayed behind at Tranquility Base. I am still there, sitting in the dust, the silent witness to the first human footsteps on another world.`,
    },
  ]

  export default function StoriesPage() {
  // State to hold the ID of the story currently being read (null = show grid)
  const [selectedStoryId, setSelectedStoryId] = useState(null)

  // Find the full story object if one is selected
  const activeStory = STORIES.find(s => s.id === selectedStoryId)

  //The Full Story Reader
  if (activeStory) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-slate-100">
        <button 
          onClick={() => setSelectedStoryId(null)}
          className="text-sm text-blue-400 hover:text-blue-300 mb-8 flex items-center gap-2"
        >
          &larr; Back to all stories
        </button>

        <article className={`rounded-xl border ${activeStory.color} bg-slate-900 p-8 md:p-12`}>
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">{activeStory.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeStory.title}</h1>
            <p className="text-slate-400 uppercase tracking-widest text-sm">{activeStory.artifact}</p>
          </div>
          
          <p className="text-slate-300 leading-relaxed text-lg md:text-xl font-serif">
            {activeStory.text}
          </p>
        </article>
      </div>
    )
  }

  //The Grid of Stories
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-100">
      <h1 className="text-3xl font-bold mb-2">Stories from the Dust</h1>
      <p className="text-slate-400 mb-10">Select a machine to read its adventure.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelectedStoryId(story.id)}
            className={`text-left rounded-xl border ${story.color} bg-slate-900 p-6 hover:bg-slate-800 transition-colors group`}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl group-hover:scale-110 transition-transform">{story.icon}</span>
              <div>
                <h2 className="text-xl font-semibold text-white">{story.title}</h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{story.artifact}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              {story.preview}
            </p>
            <p className="text-blue-400 text-sm mt-4 font-medium group-hover:text-blue-300">
              Read story &rarr;
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}