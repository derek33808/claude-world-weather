// Mock data for weather API responses

export const mockWeatherResponse = {
  current_weather: {
    temperature: 22.5,
    weathercode: 1,
    windspeed: 12.3,
    winddirection: 180,
    is_day: 1
  },
  hourly: {
    temperature_2m: [22, 23, 24],
    relativehumidity_2m: [65, 62, 60]
  }
}

export const mockGeocodeResponse = {
  address: {
    city: 'Tokyo',
    country: 'Japan',
    state: 'Tokyo Prefecture'
  },
  display_name: 'Tokyo, Japan'
}

export const mockWeatherData = {
  temperature: 22.5,
  weatherCode: 1,
  windSpeed: 12.3,
  windDirection: 180,
  humidity: 65,
  isDay: true,
  description: 'Mainly clear',
  icon: 'sun'
}

export const mockLocation = {
  city: 'Tokyo',
  country: 'Japan',
  displayName: 'Tokyo, Japan',
  lat: 35.6762,
  lng: 139.6503
}

// Mock weather codes for different conditions
export const weatherCodeScenarios = {
  clear: { code: 0, type: 'clear', description: 'Clear sky', icon: 'sun' },
  partlyCloudy: { code: 2, type: 'cloudy', description: 'Partly cloudy', icon: 'cloud-sun' },
  rain: { code: 61, type: 'rain', description: 'Slight rain', icon: 'cloud-rain' },
  snow: { code: 71, type: 'snow', description: 'Slight snow', icon: 'snowflake' },
  storm: { code: 95, type: 'storm', description: 'Thunderstorm', icon: 'bolt' }
}

// Helper to create mock fetch response
export function createMockFetchResponse(data, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data)
  })
}

// Helper to create mock fetch error
export function createMockFetchError(message = 'Network error') {
  return Promise.reject(new Error(message))
}
