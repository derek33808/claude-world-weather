import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchWeatherData,
  reverseGeocode,
  getWeatherDescription,
  getWeatherType
} from './weatherApi'

describe('weatherApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe('fetchWeatherData', () => {
    const mockApiResponse = {
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

    it('should fetch weather data successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      })

      const result = await fetchWeatherData(35.6762, 139.6503)

      expect(result).toEqual({
        temperature: 22.5,
        weatherCode: 1,
        windSpeed: 12.3,
        windDirection: 180,
        humidity: 65,
        isDay: true
      })
    })

    it('should call API with correct URL', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      })

      await fetchWeatherData(35.6762, 139.6503)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('latitude=35.6762')
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('longitude=139.6503')
      )
    })

    it('should throw error when API returns non-ok response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(fetchWeatherData(35.6762, 139.6503)).rejects.toThrow(
        'Failed to fetch weather data'
      )
    })

    it('should handle is_day = 0 as false', async () => {
      const nightResponse = {
        ...mockApiResponse,
        current_weather: {
          ...mockApiResponse.current_weather,
          is_day: 0
        }
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(nightResponse)
      })

      const result = await fetchWeatherData(35.6762, 139.6503)

      expect(result.isDay).toBe(false)
    })
  })

  describe('reverseGeocode', () => {
    const mockGeocodeResponse = {
      address: {
        city: 'Tokyo',
        country: 'Japan'
      },
      display_name: 'Tokyo, Japan'
    }

    it('should return city and country', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGeocodeResponse)
      })

      const result = await reverseGeocode(35.6762, 139.6503)

      expect(result).toEqual({
        city: 'Tokyo',
        country: 'Japan',
        displayName: 'Tokyo, Japan'
      })
    })

    it('should fallback to town when city is not available', async () => {
      const responseWithTown = {
        address: {
          town: 'Small Town',
          country: 'Japan'
        },
        display_name: 'Small Town, Japan'
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseWithTown)
      })

      const result = await reverseGeocode(35.6762, 139.6503)

      expect(result.city).toBe('Small Town')
    })

    it('should fallback to village when city and town are not available', async () => {
      const responseWithVillage = {
        address: {
          village: 'Remote Village',
          country: 'Japan'
        },
        display_name: 'Remote Village, Japan'
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseWithVillage)
      })

      const result = await reverseGeocode(35.6762, 139.6503)

      expect(result.city).toBe('Remote Village')
    })

    it('should return coordinates when API fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await reverseGeocode(35.6762, 139.6503)

      expect(result.city).toBe('35.68°, 139.65°')
      expect(result.country).toBe('')
    })

    it('should return coordinates when fetch throws error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await reverseGeocode(35.6762, 139.6503)

      expect(result.city).toBe('35.68°, 139.65°')
      expect(result.country).toBe('')
    })

    it('should handle missing address fields', async () => {
      const responseWithoutAddress = {
        display_name: 'Unknown'
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseWithoutAddress)
      })

      const result = await reverseGeocode(35.6762, 139.6503)

      expect(result.city).toBe('Unknown')
    })
  })

  describe('getWeatherDescription', () => {
    it('should return clear sky for code 0', () => {
      const result = getWeatherDescription(0)

      expect(result).toEqual({
        description: 'Clear sky',
        icon: 'sun'
      })
    })

    it('should return mainly clear for code 1', () => {
      const result = getWeatherDescription(1)

      expect(result).toEqual({
        description: 'Mainly clear',
        icon: 'sun'
      })
    })

    it('should return partly cloudy for code 2', () => {
      const result = getWeatherDescription(2)

      expect(result).toEqual({
        description: 'Partly cloudy',
        icon: 'cloud-sun'
      })
    })

    it('should return rain for code 61', () => {
      const result = getWeatherDescription(61)

      expect(result).toEqual({
        description: 'Slight rain',
        icon: 'cloud-rain'
      })
    })

    it('should return snow for code 71', () => {
      const result = getWeatherDescription(71)

      expect(result).toEqual({
        description: 'Slight snow',
        icon: 'snowflake'
      })
    })

    it('should return thunderstorm for code 95', () => {
      const result = getWeatherDescription(95)

      expect(result).toEqual({
        description: 'Thunderstorm',
        icon: 'bolt'
      })
    })

    it('should return unknown for unrecognized code', () => {
      const result = getWeatherDescription(999)

      expect(result).toEqual({
        description: 'Unknown',
        icon: 'question'
      })
    })
  })

  describe('getWeatherType', () => {
    it('should return clear for code 0', () => {
      expect(getWeatherType(0)).toBe('clear')
    })

    it('should return clear for code 1', () => {
      expect(getWeatherType(1)).toBe('clear')
    })

    it('should return rain for codes 51-67', () => {
      expect(getWeatherType(51)).toBe('rain')
      expect(getWeatherType(61)).toBe('rain')
      expect(getWeatherType(67)).toBe('rain')
    })

    it('should return snow for codes 71-77', () => {
      expect(getWeatherType(71)).toBe('snow')
      expect(getWeatherType(75)).toBe('snow')
      expect(getWeatherType(77)).toBe('snow')
    })

    it('should return rain for codes 80-82', () => {
      expect(getWeatherType(80)).toBe('rain')
      expect(getWeatherType(82)).toBe('rain')
    })

    it('should return snow for codes 85-86', () => {
      expect(getWeatherType(85)).toBe('snow')
      expect(getWeatherType(86)).toBe('snow')
    })

    it('should return storm for code 95+', () => {
      expect(getWeatherType(95)).toBe('storm')
      expect(getWeatherType(96)).toBe('storm')
      expect(getWeatherType(99)).toBe('storm')
    })

    it('should return cloudy for other codes', () => {
      expect(getWeatherType(2)).toBe('cloudy')
      expect(getWeatherType(3)).toBe('cloudy')
      expect(getWeatherType(45)).toBe('cloudy')
    })
  })
})
