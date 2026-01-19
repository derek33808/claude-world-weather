import { motion } from 'framer-motion'
import { getWeatherType } from '../services/weatherApi'

// Beautiful animated weather icons
const WeatherIcon = ({ type, className = '' }) => {
  const icons = {
    sun: (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50" cy="50" r="20"
          fill="url(#sunGradient)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="50" y1="15" x2="50" y2="25"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${i * 45} 50 50)`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </svg>
    ),
    'cloud-sun': (
      <svg viewBox="0 0 100 100" className={className}>
        <motion.circle
          cx="35" cy="35" r="15"
          fill="#fbbf24"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M75 65 C75 50 60 45 50 50 C45 40 30 40 25 50 C15 50 10 60 15 70 C10 75 15 85 25 85 L70 85 C80 85 85 75 80 65 Z"
          fill="white"
          fillOpacity="0.95"
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </svg>
    ),
    cloud: (
      <svg viewBox="0 0 100 100" className={className}>
        <motion.path
          d="M80 60 C80 45 65 40 55 45 C50 35 35 35 30 45 C20 45 15 55 20 65 C15 70 20 80 30 80 L75 80 C85 80 90 70 85 60 Z"
          fill="white"
          fillOpacity="0.9"
          animate={{ x: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </svg>
    ),
    'cloud-rain': (
      <svg viewBox="0 0 100 100" className={className}>
        <path
          d="M75 45 C75 30 60 25 50 30 C45 20 30 20 25 30 C15 30 10 40 15 50 C10 55 15 65 25 65 L70 65 C80 65 85 55 80 45 Z"
          fill="white"
          fillOpacity="0.8"
        />
        {[0, 1, 2].map((i) => (
          <motion.line
            key={i}
            x1={30 + i * 20} y1="70" x2={25 + i * 20} y2="85"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ y: [0, 10], opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    ),
    'cloud-showers-heavy': (
      <svg viewBox="0 0 100 100" className={className}>
        <path
          d="M75 40 C75 25 60 20 50 25 C45 15 30 15 25 25 C15 25 10 35 15 45 C10 50 15 60 25 60 L70 60 C80 60 85 50 80 40 Z"
          fill="#94a3b8"
          fillOpacity="0.9"
        />
        {[0, 1, 2, 3].map((i) => (
          <motion.line
            key={i}
            x1={22 + i * 18} y1="65" x2={17 + i * 18} y2="85"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ y: [0, 15], opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </svg>
    ),
    snowflake: (
      <svg viewBox="0 0 100 100" className={className}>
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        >
          {[0, 60, 120].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 50 50)`}>
              <line x1="50" y1="20" x2="50" y2="80" stroke="#93c5fd" strokeWidth="3" />
              <line x1="50" y1="30" x2="40" y2="40" stroke="#93c5fd" strokeWidth="2" />
              <line x1="50" y1="30" x2="60" y2="40" stroke="#93c5fd" strokeWidth="2" />
              <line x1="50" y1="70" x2="40" y2="60" stroke="#93c5fd" strokeWidth="2" />
              <line x1="50" y1="70" x2="60" y2="60" stroke="#93c5fd" strokeWidth="2" />
            </g>
          ))}
        </motion.g>
      </svg>
    ),
    bolt: (
      <svg viewBox="0 0 100 100" className={className}>
        <path
          d="M70 35 C70 22 57 18 48 22 C44 14 32 14 27 22 C18 22 14 30 18 38 C14 42 18 50 26 50 L65 50 C73 50 77 42 73 35 Z"
          fill="#64748b"
        />
        <motion.path
          d="M55 50 L45 65 L52 65 L42 85 L58 60 L50 60 L60 50 Z"
          fill="#fbbf24"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </svg>
    ),
    smog: (
      <svg viewBox="0 0 100 100" className={className}>
        {[30, 50, 70].map((y, i) => (
          <motion.line
            key={i}
            x1="20" y1={y} x2="80" y2={y}
            stroke="#94a3b8"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.7, 0.3], x: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </svg>
    ),
    question: (
      <svg viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="35" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <text x="50" y="60" textAnchor="middle" fontSize="40" fill="#94a3b8">?</text>
      </svg>
    )
  }

  return icons[type] || icons.question
}

export default function WeatherCard({ weather, location, onClose, unit = 'celsius' }) {
  const weatherType = getWeatherType(weather.weatherCode)
  const temp = unit === 'fahrenheit'
    ? Math.round(weather.temperature * 9/5 + 32)
    : Math.round(weather.temperature)

  const bgColors = {
    clear: 'from-amber-500/30 via-orange-500/20 to-yellow-500/30',
    rain: 'from-blue-600/30 via-slate-600/20 to-blue-500/30',
    snow: 'from-blue-300/30 via-slate-300/20 to-white/30',
    storm: 'from-slate-700/30 via-purple-800/20 to-slate-600/30',
    cloudy: 'from-slate-500/30 via-gray-500/20 to-slate-400/30'
  }

  const borderColors = {
    clear: 'border-amber-400/30',
    rain: 'border-blue-400/30',
    snow: 'border-blue-200/30',
    storm: 'border-purple-500/30',
    cloudy: 'border-gray-400/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20"
    >
      <div className={`
        relative overflow-hidden
        bg-gradient-to-br ${bgColors[weatherType]}
        backdrop-blur-xl
        border ${borderColors[weatherType]}
        rounded-3xl p-6 w-80
        shadow-2xl shadow-black/30
      `}>
        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                     rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Location header */}
        <div className="mb-6 pr-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            {location?.city || 'Unknown Location'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm mt-1"
          >
            {location?.country}
          </motion.p>
        </div>

        {/* Main weather display */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24"
          >
            <WeatherIcon type={weather.icon} className="w-full h-full" />
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start"
            >
              <span className="text-6xl font-light text-white tracking-tighter">
                {temp}
              </span>
              <span className="text-2xl text-white/80 mt-2">°{unit === 'fahrenheit' ? 'F' : 'C'}</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm font-medium mt-1"
            >
              {weather.description}
            </motion.p>
          </div>
        </div>

        {/* Weather details grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4 4 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
              </svg>
              <span className="text-white/60 text-xs">Humidity</span>
            </div>
            <p className="text-white text-xl font-semibold">{weather.humidity}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span className="text-white/60 text-xs">Wind</span>
            </div>
            <p className="text-white text-xl font-semibold">{weather.windSpeed}<span className="text-sm ml-1">km/h</span></p>
          </div>
        </motion.div>

        {/* Coordinates footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{location?.lat?.toFixed(2)}°, {location?.lng?.toFixed(2)}°</span>
          </div>
          <div className="text-white/40 text-xs">
            {weather.isDay ? '☀️ Day' : '🌙 Night'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
