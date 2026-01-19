import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchCities } from '../data/cities'

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// Search cities via Nominatim API
async function searchCitiesOnline(query) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        }
      }
    )
    const data = await response.json()
    return data
      .map(item => ({
        name: item.address?.city || item.address?.town || item.address?.village || item.name,
        country: item.address?.country || '',
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }))
      .filter(item => item.name)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

export default function SearchBar({ onCitySelect, isMobile = false }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      // First search local cities for instant results
      const localResults = searchCities(debouncedQuery)
      setResults(localResults)
      setIsOpen(true)
      setSelectedIndex(-1)

      // Then search online for more results
      setIsLoading(true)
      searchCitiesOnline(debouncedQuery).then(onlineResults => {
        setIsLoading(false)
        // Merge results: local first, then online (avoiding duplicates)
        const localNames = new Set(localResults.map(c => `${c.name.toLowerCase()}-${c.country.toLowerCase()}`))
        const uniqueOnline = onlineResults.filter(
          c => !localNames.has(`${c.name.toLowerCase()}-${c.country.toLowerCase()}`)
        )
        const merged = [...localResults, ...uniqueOnline].slice(0, 10)
        setResults(merged)
        setIsOpen(merged.length > 0)
      })
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery])

  const handleSelect = (city) => {
    onCitySelect(city)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-72'}`}>
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search cities..."
          className={`w-full bg-white/10 backdrop-blur-md border border-white/20
                     py-3 pl-11 pr-4 text-white text-sm placeholder-white/50
                     focus:outline-none focus:border-cyan-400/50 focus:bg-white/15
                     transition-all duration-200 touch-manipulation
                     ${isMobile ? 'rounded-xl min-h-[48px]' : 'rounded-full'}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl
                       border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            {results.length === 0 && isLoading && (
              <div className="px-4 py-3 text-white/50 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </div>
            )}
            {results.length === 0 && !isLoading && (
              <div className="px-4 py-3 text-white/50 text-sm">
                No cities found
              </div>
            )}
            {results.map((city, index) => (
              <motion.button
                key={`${city.name}-${city.country}-${city.lat}`}
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setSelectedIndex(index)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`w-full px-4 py-3 text-left flex items-center justify-between
                           transition-colors touch-manipulation min-h-[52px]
                           active:bg-cyan-500/30 ${
                             selectedIndex === index
                               ? 'bg-cyan-500/20'
                               : 'hover:bg-white/5'
                           }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{city.name}</p>
                    <p className="text-white/50 text-xs truncate">{city.country}</p>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-white/30 transition-transform flex-shrink-0 ${
                    selectedIndex === index ? 'translate-x-1 text-cyan-400' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
            {isLoading && results.length > 0 && (
              <div className="px-4 py-2 text-white/30 text-xs flex items-center gap-2 border-t border-white/5">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading more...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
