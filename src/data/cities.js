// Major world cities with coordinates
export const majorCities = [
  // Asia
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, population: 37400000 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, population: 27000000 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, population: 21500000 },
  { name: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025, population: 31200000 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, population: 20700000 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, population: 9776000 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, population: 5850000 },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, population: 7500000 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, population: 10700000 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, population: 10600000 },
  { name: 'Taipei', country: 'Taiwan', lat: 25.0330, lng: 121.5654, population: 2600000 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, population: 3400000 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, population: 15500000 },

  // Europe
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, population: 9000000 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, population: 11000000 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, population: 3600000 },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, population: 6600000 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, population: 4300000 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, population: 1150000 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, population: 12500000 },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, population: 1900000 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, population: 5600000 },
  { name: 'Munich', country: 'Germany', lat: 48.1351, lng: 11.5820, population: 1500000 },

  // North America
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, population: 18800000 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, population: 12500000 },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, population: 8900000 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, population: 6200000 },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, population: 4700000 },
  { name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, population: 6200000 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, population: 2500000 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, population: 21800000 },
  { name: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321, population: 3500000 },

  // South America
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, population: 22000000 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, population: 15000000 },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, population: 13500000 },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, population: 10700000 },
  { name: 'Bogotá', country: 'Colombia', lat: 4.7110, lng: -74.0721, population: 11300000 },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693, population: 6800000 },

  // Africa
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, population: 21000000 },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, population: 15000000 },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, population: 5800000 },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, population: 4600000 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, population: 4400000 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, population: 3700000 },

  // Oceania
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, population: 5300000 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, population: 5000000 },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8509, lng: 174.7645, population: 1660000 },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251, population: 2500000 },
]

export const getCityByName = (name) => {
  return majorCities.find(city =>
    city.name.toLowerCase() === name.toLowerCase()
  )
}

export const searchCities = (query) => {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return majorCities.filter(city =>
    city.name.toLowerCase().includes(lowerQuery) ||
    city.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 8)
}
