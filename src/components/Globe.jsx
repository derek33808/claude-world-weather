import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import GlobeGL from 'react-globe.gl'
import { motion, AnimatePresence } from 'framer-motion'
import { majorCities } from '../data/cities'

export default function Globe({ onLocationClick, selectedLocation, onCityClick, onGlobeReady }) {
  const globeRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isReady, setIsReady] = useState(false)
  const [hoveredCity, setHoveredCity] = useState(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const interactionTimeoutRef = useRef(null)

  // City markers data
  const cityMarkers = useMemo(() => {
    return majorCities.map(city => ({
      ...city,
      size: Math.sqrt(city.population) / 2000,
    }))
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Handle interaction - pause rotation on zoom/drag
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true)
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    if (globeRef.current) {
      const controls = globeRef.current.controls()
      if (controls) {
        controls.autoRotate = false
      }
    }
  }, [])

  const handleInteractionEnd = useCallback(() => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    // Resume rotation after 5 seconds of no interaction
    interactionTimeoutRef.current = setTimeout(() => {
      if (globeRef.current && !selectedLocation) {
        const controls = globeRef.current.controls()
        if (controls) {
          controls.autoRotate = true
        }
      }
      setIsInteracting(false)
    }, 5000)
  }, [selectedLocation])

  useEffect(() => {
    if (globeRef.current) {
      setTimeout(() => {
        const controls = globeRef.current.controls()
        if (controls) {
          controls.autoRotate = true
          controls.autoRotateSpeed = 0.3
          controls.enableZoom = true
          controls.minDistance = 150
          controls.maxDistance = 500

          // Listen for user interactions
          controls.addEventListener('start', handleInteractionStart)
          controls.addEventListener('end', handleInteractionEnd)
        }
        setIsReady(true)
      }, 100)
    }

    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }
  }, [handleInteractionStart, handleInteractionEnd])

  useEffect(() => {
    if (selectedLocation && globeRef.current && isReady) {
      const controls = globeRef.current.controls()
      if (controls) {
        controls.autoRotate = false
      }
      globeRef.current.pointOfView({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        altitude: 1.8
      }, 1000)
    }
  }, [selectedLocation, isReady])

  const handleGlobeClick = ({ lat, lng }) => {
    if (onLocationClick) {
      onLocationClick(lat, lng)
    }
  }

  const handleLabelClick = (city) => {
    if (onCityClick) {
      onCityClick(city)
    } else if (onLocationClick) {
      onLocationClick(city.lat, city.lng)
    }
  }

  // Keep dot radius constant to avoid flickering
  const dotRadius = 0.5

  // Handle city hover - also pause rotation
  const handleLabelHover = useCallback((city) => {
    setHoveredCity(city)
    if (city) {
      // Stop rotation when hovering
      handleInteractionStart()
    } else {
      // Resume rotation when mouse leaves
      handleInteractionEnd()
    }
  }, [handleInteractionStart, handleInteractionEnd])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="relative"
    >
      <GlobeGL
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere={true}
        atmosphereColor="#4f9cff"
        atmosphereAltitude={0.2}
        onGlobeClick={handleGlobeClick}
        onGlobeReady={() => onGlobeReady && onGlobeReady()}
        animateIn={true}

        // City labels with hover effect
        labelsData={cityMarkers}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={1.4}
        labelDotRadius={dotRadius}
        labelColor={() => 'rgba(255, 255, 255, 0.9)'}
        labelAltitude={0.02}
        labelDotOrientation={() => 'bottom'}
        onLabelClick={handleLabelClick}
        onLabelHover={handleLabelHover}
      />

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredCity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30
                       bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl
                       border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div>
                <p className="font-medium">{hoveredCity.name}</p>
                <p className="text-white/60 text-xs">{hoveredCity.country} • Click to view weather</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
