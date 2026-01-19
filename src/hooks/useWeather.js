import { useState, useCallback } from 'react'
import { fetchWeatherData, reverseGeocode, getWeatherDescription } from '../services/weatherApi'

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (lat, lng) => {
    setLoading(true)
    setError(null)

    try {
      const [weatherData, locationData] = await Promise.all([
        fetchWeatherData(lat, lng),
        reverseGeocode(lat, lng)
      ])

      const weatherInfo = getWeatherDescription(weatherData.weatherCode)

      setWeather({
        ...weatherData,
        description: weatherInfo.description,
        icon: weatherInfo.icon
      })

      setLocation({
        ...locationData,
        lat,
        lng
      })
    } catch (err) {
      setError(err.message || 'Failed to fetch weather')
      setWeather(null)
      setLocation(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearWeather = useCallback(() => {
    setWeather(null)
    setLocation(null)
    setError(null)
  }, [])

  return {
    weather,
    location,
    loading,
    error,
    fetchWeather,
    clearWeather
  }
}
