import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import FeatureWalkthrough from './FeaturesWalkthrough'

const techFeatures = [
  { title: 'Leaflet + react-leaflet', description: 'Interactive maps, markers, and responsive map layers for every screen.' },
  { title: 'dnd-kit drag-and-drop', description: 'Smooth reorder interactions for itinerary stops and planning flow.' },
  { title: 'OSMR Routing API', description: 'Optimized routing ensures better travel paths between stops.' },
  { title: 'Photon autosuggestion', description: 'Live place suggestions speed up search and surface locations accurately.' },
  { title: 'OpenCage geocoding', description: 'Converts typed place names into coordinates for search and routing.' },
  { title: 'Overpass API', description: 'Queries OpenStreetMap data to surface nearby places, attractions, and amenities within a defined radius.' }
]

function Features() {
  const navigate = useNavigate()

  return (
    <div className="w-full bg-white">

      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 px-6 sm:px-10 lg:px-20 pt-24 pb-28">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">

          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-teal-700 shadow-sm ring-1 ring-teal-200">
            Built for Indian Travelers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] m-0">
            Design smarter trips<br className="hidden sm:block" /> with{' '}
            <span className="text-teal-600">WanderWhere</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 leading-relaxed m-0 max-w-xl">
            From interactive map indicating routes and stops to adding custom stops, smart budget planning with a proper day by day itineary chart — build a complete itinerary in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <button
              onClick={() => navigate('/planyourtrip')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-3.5 text-white text-sm font-semibold transition hover:bg-teal-700 w-full sm:w-auto"
            >
              Start planning
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
            <button
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-slate-600 text-sm font-semibold transition hover:bg-slate-50 w-full sm:w-auto"
            >
              Explore features
            </button>
          </div>

        </div>
      </section>

      <FeatureWalkthrough />


      <section className="bg-slate-950 px-6 sm:px-10 lg:px-20 py-16 text-white">
        <div className="max-w-6xl mx-auto">

          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-teal-400 font-semibold mb-3 m-0">Developer-ready</p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white m-0">API & tech stack</h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm m-0">
                WanderWhere is built with React and Tailwind CSS, powered by modern location APIs, and deployed on Vercel.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {techFeatures.map((tech, index) => (
              <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
                <p className="text-teal-400 font-semibold text-sm mb-1.5 m-0">{tech.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed m-0">{tech.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}

export default Features