import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Globe from './components/Globe'
import WeatherCard from './components/WeatherCard'
import WeatherBackground from './components/WeatherBackground'
import LoadingSpinner from './components/LoadingSpinner'
import SearchBar from './components/SearchBar'
import { useWeather } from './hooks/useWeather'

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [unit, setUnit] = useState('celsius')
  const { weather, location, loading, error, fetchWeather, clearWeather } = useWeather()

  const handleGlobeClick = async (lat, lng) => {
    setSelectedLocation({ lat, lng })
    await fetchWeather(lat, lng)
  }

  const handleCitySelect = async (city) => {
    setSelectedLocation({
      lat: city.lat,
      lng: city.lng,
      city: city.name
    })
    await fetchWeather(city.lat, city.lng)
  }

  const handleClose = () => {
    setSelectedLocation(null)
    clearWeather()
  }

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius')
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <WeatherBackground weatherCode={weather?.weatherCode} />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Weather Explorer</h1>
              <p className="text-white/50 text-xs">Real-time global weather</p>
            </div>
          </motion.div>

          {/* Search and controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <SearchBar onCitySelect={handleCitySelect} />

            {/* Unit toggle */}
            <button
              onClick={toggleUnit}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full
                       px-4 py-3 text-white text-sm font-medium
                       hover:bg-white/15 transition-all duration-200
                       flex items-center gap-2"
            >
              <span className={unit === 'celsius' ? 'text-cyan-400' : 'text-white/50'}>°C</span>
              <span className="text-white/30">/</span>
              <span className={unit === 'fahrenheit' ? 'text-cyan-400' : 'text-white/50'}>°F</span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Globe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Globe
          onLocationClick={handleGlobeClick}
          onCityClick={handleCitySelect}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <LoadingSpinner />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Card */}
      <AnimatePresence>
        {weather && !loading && (
          <WeatherCard
            weather={weather}
            location={location}
            unit={unit}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Error notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2
                       bg-red-500/20 backdrop-blur-xl border border-red-500/30
                       text-red-200 px-6 py-3 rounded-full z-30
                       flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-6 z-10"
      >
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
          <p className="text-white/50 text-xs">
            Click globe or city • Drag to rotate • Scroll to zoom
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default App
