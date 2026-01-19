import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getWeatherType } from '../services/weatherApi'

function Particle({ type, index }) {
  const [position] = useState({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4
  })

  if (type === 'rain') {
    return (
      <motion.div
        className="absolute w-0.5 h-4 bg-blue-400/40 rounded-full"
        style={{ left: `${position.left}%` }}
        initial={{ top: '-5%', opacity: 0 }}
        animate={{ top: '105%', opacity: [0, 1, 1, 0] }}
        transition={{
          duration: position.duration * 0.5,
          repeat: Infinity,
          delay: position.delay,
          ease: 'linear'
        }}
      />
    )
  }

  if (type === 'snow') {
    return (
      <motion.div
        className="absolute w-2 h-2 bg-white/60 rounded-full"
        style={{ left: `${position.left}%` }}
        initial={{ top: '-5%', opacity: 0 }}
        animate={{
          top: '105%',
          opacity: [0, 1, 1, 0],
          x: [0, 20, -20, 10, 0]
        }}
        transition={{
          duration: position.duration,
          repeat: Infinity,
          delay: position.delay,
          ease: 'linear'
        }}
      />
    )
  }

  if (type === 'clear') {
    return (
      <motion.div
        className="absolute w-1 h-1 bg-yellow-200/30 rounded-full"
        style={{
          left: `${position.left}%`,
          top: `${Math.random() * 100}%`
        }}
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: position.duration,
          repeat: Infinity,
          delay: position.delay
        }}
      />
    )
  }

  return null
}

export default function WeatherBackground({ weatherCode }) {
  const [particles, setParticles] = useState([])
  const weatherType = weatherCode !== undefined ? getWeatherType(weatherCode) : 'clear'

  useEffect(() => {
    const count = weatherType === 'rain' ? 50 :
                  weatherType === 'snow' ? 30 :
                  weatherType === 'clear' ? 20 : 0

    setParticles(Array.from({ length: count }, (_, i) => i))
  }, [weatherType])

  const bgGradients = {
    clear: 'from-indigo-900 via-purple-900 to-indigo-900',
    rain: 'from-gray-800 via-blue-900 to-gray-800',
    snow: 'from-slate-700 via-blue-800 to-slate-700',
    storm: 'from-gray-900 via-purple-950 to-gray-900',
    cloudy: 'from-gray-800 via-slate-800 to-gray-800'
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={weatherType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${bgGradients[weatherType] || bgGradients.cloudy}`}
        />
      </AnimatePresence>

      {/* Particles */}
      <div className="absolute inset-0">
        {particles.map((i) => (
          <Particle
            key={`${weatherType}-${i}`}
            type={weatherType}
            index={i}
          />
        ))}
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}
      />
    </div>
  )
}
