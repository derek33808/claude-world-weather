import { useState, useEffect } from 'react'
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
  const [globeLoading, setGlobeLoading] = useState(true)
  const [locating, setLocating] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { weather, location, loading, error, fetchWeather, clearWeather, setError } = useWeather()

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setSelectedLocation({ lat: latitude, lng: longitude })
        await fetchWeather(latitude, longitude)
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable. Please try again.')
            break
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.')
            break
          default:
            setError('Unable to get your location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleGlobeReady = () => {
    setGlobeLoading(false)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <WeatherBackground weatherCode={weather?.weatherCode} />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 md:gap-3"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white">Weather Explorer</h1>
              <p className="text-white/50 text-xs hidden sm:block">Real-time global weather</p>
            </div>
          </motion.div>

          {/* Desktop: Search and controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-4"
          >
            <SearchBar onCitySelect={handleCitySelect} />

            {/* Locate me button */}
            <button
              onClick={handleLocate}
              disabled={locating || loading}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full
                       px-4 py-3 text-white text-sm font-medium
                       hover:bg-white/15 transition-all duration-200
                       flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Get my location"
            >
              {locating ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <span>{locating ? 'Locating...' : 'My Location'}</span>
            </button>

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

          {/* Mobile: Hamburger menu button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-full
                     p-3 text-white hover:bg-white/15 transition-all duration-200
                     active:scale-95 touch-manipulation"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4"
            >
              {/* Mobile search bar */}
              <SearchBar onCitySelect={(city) => { handleCitySelect(city); setMobileMenuOpen(false); }} isMobile={true} />

              {/* Mobile action buttons */}
              <div className="flex gap-3">
                {/* Locate me button - mobile */}
                <button
                  onClick={() => { handleLocate(); setMobileMenuOpen(false); }}
                  disabled={locating || loading}
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl
                           px-4 py-3 text-white text-sm font-medium
                           hover:bg-white/15 active:bg-white/20 transition-all duration-200
                           flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                           touch-manipulation min-h-[48px]"
                >
                  {locating ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <span className="text-sm">{locating ? 'Locating...' : 'My Location'}</span>
                </button>

                {/* Unit toggle - mobile */}
                <button
                  onClick={toggleUnit}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl
                           px-4 py-3 text-white text-sm font-medium
                           hover:bg-white/15 active:bg-white/20 transition-all duration-200
                           flex items-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <span className={unit === 'celsius' ? 'text-cyan-400' : 'text-white/50'}>°C</span>
                  <span className="text-white/30">/</span>
                  <span className={unit === 'fahrenheit' ? 'text-cyan-400' : 'text-white/50'}>°F</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Globe */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Globe
          onLocationClick={handleGlobeClick}
          onCityClick={handleCitySelect}
          selectedLocation={selectedLocation}
          onGlobeReady={handleGlobeReady}
        />
      </div>

      {/* Globe loading overlay */}
      <AnimatePresence>
        {globeLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950 z-30"
          >
            <div className="text-center">
              <LoadingSpinner />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-sm mt-4"
              >
                Loading Earth...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather loading overlay */}
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

      {/* Footer hint - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 md:bottom-6 left-4 md:left-6 z-10 hidden sm:block"
      >
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl px-3 md:px-4 py-2 md:py-3">
          <p className="text-white/50 text-xs">
            Click globe or city • Drag to rotate • Scroll to zoom
          </p>
        </div>
      </motion.div>

      {/* Mobile hint - tap friendly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-4 right-4 z-10 sm:hidden"
      >
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl px-3 py-2 text-center">
          <p className="text-white/50 text-xs">
            Tap globe or use menu to search
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default App
