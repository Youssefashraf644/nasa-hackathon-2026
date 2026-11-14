import { useState } from 'react'

const IMAGES = [
  { src: '/images/astronaut.png', alt: 'Astronaut exploring', title: 'Explorer' },
  { src: '/images/eagle.png', alt: 'Apollo 11 Eagle lander', title: 'The Eagle' },
  { src: '/images/eagle_2.png', alt: 'Apollo 11 Eagle lander alternate view', title: 'Eagle Descent Stage' },
  { src: '/images/tracks.png', alt: 'Rover tracks on Mars', title: 'Tracks on Mars' },
  { src: '/images/satlite.png', alt: 'Satellite in orbit', title: 'Orbiter' },
  { src: '/images/HiRISE.png', alt: 'HiRISE camera view', title: 'HiRISE View' },
  { src: '/images/opportunity.png', alt: 'Opportunity rover', title: 'Opportunity' },
  { src: '/images/spirit.png', alt: 'Spirit rover', title: 'Spirit' },
]

export default function ImagesPage() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-slate-100">
      <h1 className="text-3xl font-bold mb-2">Image Gallery</h1>
      <p className="text-slate-400 mb-8">Photos from the missions and the hardware we left behind.</p>

      {/* Masonry-style Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {IMAGES.map((img, index) => (
          <div 
            key={index} 
            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
            onClick={() => setSelectedImage(img)}
          >
            <img 
              src={img.src} 
              alt={img.alt} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white font-semibold">{img.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal (shows when an image is clicked) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)} // Click background to close
        >
          <div 
            className="relative max-w-5xl w-full max-h-screen"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setSelectedImage(null)}
                className="bg-slate-800 text-white rounded-full p-2 hover:bg-slate-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-4 left-4 bg-slate-900/80 px-4 py-2 rounded-lg">
              <p className="text-white font-medium">{selectedImage.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}