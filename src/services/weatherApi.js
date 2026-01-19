const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast'
const GEOCODING_API_BASE = 'https://nominatim.openstreetmap.org/reverse'

export async function fetchWeatherData(lat, lng) {
  const url = `${WEATHER_API_BASE}?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data = await response.json()
  return {
    temperature: data.current_weather.temperature,
    weatherCode: data.current_weather.weathercode,
    windSpeed: data.current_weather.windspeed,
    windDirection: data.current_weather.winddirection,
    humidity: data.hourly.relativehumidity_2m[0],
    isDay: data.current_weather.is_day === 1
  }
}

export async function reverseGeocode(lat, lng) {
  const url = `${GEOCODING_API_BASE}?lat=${lat}&lon=${lng}&format=json&zoom=10`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      // Return default values if geocoding fails
      return { city: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, country: '', displayName: '' }
    }

    const data = await response.json()

    const city = data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      data.address?.state ||
      'Unknown'

    const country = data.address?.country || ''

    return { city, country, displayName: data.display_name }
  } catch (error) {
    // Return coordinates if geocoding fails
    return { city: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, country: '', displayName: '' }
  }
}

export function getWeatherDescription(code) {
  const weatherCodes = {
    0: { description: 'Clear sky', icon: 'sun' },
    1: { description: 'Mainly clear', icon: 'sun' },
    2: { description: 'Partly cloudy', icon: 'cloud-sun' },
    3: { description: 'Overcast', icon: 'cloud' },
    45: { description: 'Foggy', icon: 'smog' },
    48: { description: 'Depositing rime fog', icon: 'smog' },
    51: { description: 'Light drizzle', icon: 'cloud-rain' },
    53: { description: 'Moderate drizzle', icon: 'cloud-rain' },
    55: { description: 'Dense drizzle', icon: 'cloud-rain' },
    61: { description: 'Slight rain', icon: 'cloud-rain' },
    63: { description: 'Moderate rain', icon: 'cloud-showers-heavy' },
    65: { description: 'Heavy rain', icon: 'cloud-showers-heavy' },
    71: { description: 'Slight snow', icon: 'snowflake' },
    73: { description: 'Moderate snow', icon: 'snowflake' },
    75: { description: 'Heavy snow', icon: 'snowflake' },
    77: { description: 'Snow grains', icon: 'snowflake' },
    80: { description: 'Slight rain showers', icon: 'cloud-rain' },
    81: { description: 'Moderate rain showers', icon: 'cloud-showers-heavy' },
    82: { description: 'Violent rain showers', icon: 'cloud-showers-heavy' },
    85: { description: 'Slight snow showers', icon: 'snowflake' },
    86: { description: 'Heavy snow showers', icon: 'snowflake' },
    95: { description: 'Thunderstorm', icon: 'bolt' },
    96: { description: 'Thunderstorm with hail', icon: 'bolt' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'bolt' }
  }

  return weatherCodes[code] || { description: 'Unknown', icon: 'question' }
}

export function getWeatherType(code) {
  if (code === 0 || code === 1) return 'clear'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'rain'
  if (code >= 85 && code <= 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloudy'
}
