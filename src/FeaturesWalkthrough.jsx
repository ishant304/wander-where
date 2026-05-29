import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapPin, faRoute, faCar, faUtensils,
  faCalendarDays, faUsers, faCompass, faMap,
  faPiggyBank, faClock, faLocationDot,
  faShuffle
} from '@fortawesome/free-solid-svg-icons'
import { faWpforms } from '@fortawesome/free-brands-svg-icons/faWpforms'

/* ─── DATA ─────────────────────────────────────────────── */

const categories = [
  {
    id: 'discover',
    label: '01 — Discover',
    heading: 'Find any place, instantly.',
    sub: 'Search and explore with tools built for Indian geography — from metro cities to hidden waterfalls.',
    layout: 'split',
    color: { pill: '#ccfbf1', pillText: '#0f766e', icon: '#0d9488', iconBg: '#ccfbf1', accent: '#0d9488', border: '#99f6e4' },
    features: [
      { icon: faMapPin,     title: 'Destination suggestions',      desc: 'Cities, landmarks, and tourist spots suggest places on map as well as when you search' },
      { icon: faCompass,    title: 'Use your Current location',           desc: "One tap sets your device's GPS position as the trip origin — no typing your city every time." },
      { icon: faLocationDot,title: 'Nearby places suggestions',    desc: 'Spots within a 70 km radius are auto-suggested so you never miss a worthwhile detour.' },
      { icon: faRoute,      title: 'Choose destination from map', desc: "Browse an interactive Leaflet map and tap any marker to drop it straight into your itinerary." },
    ],
  },
  {
    id: 'plan',
    label: '02 — Plan',
    heading: 'Build your itinerary your way.',
    sub: 'A single form captures everything. Then drag, drop, and customise until the trip feels right.',
    layout: 'steps',
    color: { pill: '#cffafe', pillText: '#0e7490', icon: '#0891b2', iconBg: '#cffafe', accent: '#0891b2', border: '#a5f3fc' },
    features: [
      { icon: faWpforms, title: 'One-form setup',          desc: 'Origin, destination, group size, duration, meals, stay and budget — all in one cohesive form.' },
      { icon: faShuffle,        title: 'Reorder your whole Itineary',     desc: 'Reorder stops across days with fluid dnd-kit interactions. The route updates when you final itineary is ready.' },
      { icon: faLocationDot,     title: 'Custom stop insertion',   desc: 'Search and insert a custom place or a detour you want anywhere in your itinerary.' },
    ],
  },
  {
    id: 'budget',
    label: '03 — Budget',
    heading: 'Know exactly where every rupee goes.',
    sub: 'Smart cost estimation across transport, food, and stay — tailored to your group and travel style.',
    layout: 'stats',
    color: { pill: '#d1fae5', pillText: '#065f46', icon: '#059669', iconBg: '#d1fae5', accent: '#059669', border: '#bbf7d0' },
    features: [
      { icon: faPiggyBank, title: 'Detailed budget planner', stat: '₹ breakdown', desc: 'Line-by-line budget generated from meal type, stay preference, trip type, and traveller count.' },
      { icon: faCar,       title: 'Different vehicle comparison',      stat: '6 modes',     desc: 'You can calculate your budget for different transport type with custom mileage functionality' },
      { icon: faClock,     title: 'Day-by-day itineary plan',      stat: 'Per day',     desc: "A chart breaks down each day's stops, route, distances, estimated travel time and road taken to reach at a glance." },
      { icon: faMap,       title: 'Live itinerary map',      stat: 'Real-time',   desc: 'Every stop renders on a live map with optimised routing segments so the journey shape is always clear.' },
    ],
  },
]

function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.07 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [ref])
  return inView
}


function SplitLayout({ cat, inView }) {
  const [active, setActive] = useState(0)
  const f = cat.features[active]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">

      {/* Visual panel */}
      <div
        className="rounded-3xl border p-8 sm:p-12 flex flex-col justify-between min-h-64"
        style={{
          background: '#f0fdfa', borderColor: cat.color.border,
          opacity: inView ? 1 : 0, transition: 'opacity 0.5s',
        }}
      >
        <div>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7"
            style={{ background: '#fff', boxShadow: '0 2px 12px rgba(13,148,136,0.12)' }}
          >
            <FontAwesomeIcon icon={f.icon} style={{ fontSize: '24px', color: cat.color.icon }} />
          </div>
          <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
            {f.title}
          </h4>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {f.desc}
          </p>
        </div>
        {/* dot nav */}
        <div className="flex gap-2 mt-8">
          {cat.features.map((_, i) => (
            <button
              key={i} onClick={() => setActive(i)}
              style={{
                width: i === active ? '28px' : '8px', height: '8px',
                borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: i === active ? cat.color.icon : cat.color.border,
                transition: 'width 0.3s, background 0.2s', padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* List panel */}
      <div className="flex flex-col gap-2">
        {cat.features.map((feat, i) => (
          <button
            key={i} onClick={() => setActive(i)}
            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-left cursor-pointer w-full"
            style={{
              background: i === active ? '#ffffff' : 'transparent',
              border: i === active ? `1.5px solid ${cat.color.accent}` : '1.5px solid transparent',
              transition: 'all 0.22s',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(20px)',
              transitionDelay: `${i * 80}ms`,
            }}
          >
            <div
              className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
              style={{
                background: i === active ? cat.color.iconBg : '#f1f5f9',
                transition: 'background 0.2s',
              }}
            >
              <FontAwesomeIcon icon={feat.icon} style={{ fontSize: '14px', color: i === active ? cat.color.icon : '#94a3b8' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 m-0">{feat.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug truncate">{feat.desc.slice(0, 52)}…</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}


function StepsLayout({ cat, inView }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cat.features.map((feat, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 relative overflow-hidden"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.5s ${i * 100}ms, transform 0.5s ${i * 100}ms`,
          }}
        >
          <div
            className="absolute top-0 right-3 text-8xl font-extrabold leading-none select-none pointer-events-none"
            style={{ color: '#f0fdfa', letterSpacing: '-0.05em' }}
          >
            {i + 1}
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: cat.color.iconBg }}
          >
            <FontAwesomeIcon icon={feat.icon} style={{ fontSize: '16px', color: cat.color.icon }} />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-2">{feat.title}</h4>
          <p className="text-sm text-slate-500 leading-relaxed m-0">{feat.desc}</p>
        </div>
      ))}
    </div>
  )
}


function StatsLayout({ cat, inView }) {
  const top = cat.features.slice(0, 2)
  const bottom = cat.features.slice(2)
  return (
    <div className="flex flex-col gap-4">
      {/* top 2 — tall cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {top.map((feat, i) => (
          <div
            key={i}
            className="rounded-2xl p-7 sm:p-8"
            style={{
              background: '#f0fdf4', border: `1px solid ${cat.color.border}`,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ${i * 100}ms, transform 0.5s ${i * 100}ms`,
            }}
          >
            <div
              className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 mb-6"
              style={{ border: `1px solid ${cat.color.border}` }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: cat.color.iconBg }}
              >
                <FontAwesomeIcon icon={feat.icon} style={{ fontSize: '10px', color: cat.color.icon }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: cat.color.pillText }}>{feat.stat}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">{feat.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed m-0">{feat.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bottom.map((feat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.5s ${(i + 2) * 100}ms, transform 0.5s ${(i + 2) * 100}ms`,
            }}
          >
            <div
              className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center"
              style={{ background: cat.color.iconBg }}
            >
              <FontAwesomeIcon icon={feat.icon} style={{ fontSize: '16px', color: cat.color.icon }} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 m-0 mb-0.5">{feat.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed m-0">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


function CategorySection({ cat }) {
  const ref = useRef(null)
  const inView = useInView(ref)

  return (
    <div ref={ref} className="mb-20 sm:mb-24">
      <div
        className="mb-8 sm:mb-9"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      >
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
          style={{ background: cat.color.pill, color: cat.color.pillText }}
        >
          {cat.label}
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-10">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight m-0">
            {cat.heading}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed m-0 sm:max-w-sm sm:pb-1">
            {cat.sub}
          </p>
        </div>
      </div>

      {cat.layout === 'split' && <SplitLayout cat={cat} inView={inView} />}
      {cat.layout === 'steps' && <StepsLayout cat={cat} inView={inView} />}
      {cat.layout === 'stats' && <StatsLayout cat={cat} inView={inView} />}
    </div>
  )
}


export default function FeatureWalkthrough() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef)

  return (
    <section className="bg-slate-50 px-5 sm:px-10 lg:px-20 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16 sm:mb-20"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s, transform 0.6s',
          }}
        >
          <div className="inline-flex items-center gap-2 bg-white text-teal-700 text-sm font-semibold px-4 py-2 rounded-full mb-5 border border-teal-100 shadow-sm">
            Feature walkthrough
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Everything a trip needs,<br />
            <span className="text-teal-600">nothing it doesn't.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
            Three focused areas — discover, plan, and budget — each designed to work seamlessly together.
          </p>
        </div>

        {/* Categories */}
        {categories.map((cat) => (
          <CategorySection key={cat.id} cat={cat} />
        ))}

        {/* CTA strip */}
        <div className="border-t border-slate-200 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <p className="text-sm sm:text-base text-slate-500 m-0">
            <span className="text-slate-900 font-bold">Ready to plan?</span> It takes under 2 minutes to build your first itinerary.
          </p>
          <button
            onClick={() => window.location.href = '/planyourtrip'}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm sm:text-base font-semibold px-7 py-3.5 rounded-full border-none cursor-pointer transition-colors shrink-0"
          >
            Start planning →
          </button>
        </div>
      </div>
    </section>
  )
}