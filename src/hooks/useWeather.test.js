import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useWeather } from './useWeather'
import * as weatherApi from '../services/weatherApi'

// Mock the weatherApi module
vi.mock('../services/weatherApi', () => ({
  fetchWeatherData: vi.fn(),
  reverseGeocode: vi.fn(),
  getWeatherDescription: vi.fn()
}))

describe('useWeather hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWeather())

    expect(result.current.weather).toBeNull()
    expect(result.current.location).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set loading to true when fetching weather', async () => {
    // Setup mocks to delay response
    weatherApi.fetchWeatherData.mockImplementation(() => new Promise(() => {}))
    weatherApi.reverseGeocode.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useWeather())

    act(() => {
      result.current.fetchWeather(35.6762, 139.6503)
    })

    expect(result.current.loading).toBe(true)
  })

  it('should fetch weather data successfully', async () => {
    const mockWeatherData = {
      temperature: 22.5,
      weatherCode: 1,
      windSpeed: 12.3,
      humidity: 65,
      isDay: true
    }

    const mockLocationData = {
      city: 'Tokyo',
      country: 'Japan',
      displayName: 'Tokyo, Japan'
    }

    weatherApi.fetchWeatherData.mockResolvedValue(mockWeatherData)
    weatherApi.reverseGeocode.mockResolvedValue(mockLocationData)
    weatherApi.getWeatherDescription.mockReturnValue({
      description: 'Mainly clear',
      icon: 'sun'
    })

    const { result } = renderHook(() => useWeather())

    await act(async () => {
      await result.current.fetchWeather(35.6762, 139.6503)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.weather).toEqual({
      ...mockWeatherData,
      description: 'Mainly clear',
      icon: 'sun'
    })
    expect(result.current.location).toEqual({
      ...mockLocationData,
      lat: 35.6762,
      lng: 139.6503
    })
  })

  it('should handle API error', async () => {
    const errorMessage = 'Failed to fetch weather data'
    weatherApi.fetchWeatherData.mockRejectedValue(new Error(errorMessage))
    weatherApi.reverseGeocode.mockResolvedValue({})

    const { result } = renderHook(() => useWeather())

    await act(async () => {
      await result.current.fetchWeather(35.6762, 139.6503)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.weather).toBeNull()
    expect(result.current.location).toBeNull()
  })

  it('should handle geocoding error gracefully', async () => {
    const mockWeatherData = {
      temperature: 22.5,
      weatherCode: 1,
      windSpeed: 12.3,
      humidity: 65,
      isDay: true
    }

    weatherApi.fetchWeatherData.mockResolvedValue(mockWeatherData)
    weatherApi.reverseGeocode.mockRejectedValue(new Error('Geocoding failed'))
    weatherApi.getWeatherDescription.mockReturnValue({
      description: 'Mainly clear',
      icon: 'sun'
    })

    const { result } = renderHook(() => useWeather())

    await act(async () => {
      await result.current.fetchWeather(35.6762, 139.6503)
    })

    // Should still fail since Promise.all is used
    expect(result.current.error).toBe('Geocoding failed')
  })

  it('should clear weather data', async () => {
    const mockWeatherData = {
      temperature: 22.5,
      weatherCode: 1,
      windSpeed: 12.3,
      humidity: 65,
      isDay: true
    }

    const mockLocationData = {
      city: 'Tokyo',
      country: 'Japan',
      displayName: 'Tokyo, Japan'
    }

    weatherApi.fetchWeatherData.mockResolvedValue(mockWeatherData)
    weatherApi.reverseGeocode.mockResolvedValue(mockLocationData)
    weatherApi.getWeatherDescription.mockReturnValue({
      description: 'Mainly clear',
      icon: 'sun'
    })

    const { result } = renderHook(() => useWeather())

    // First fetch weather
    await act(async () => {
      await result.current.fetchWeather(35.6762, 139.6503)
    })

    expect(result.current.weather).not.toBeNull()

    // Then clear
    act(() => {
      result.current.clearWeather()
    })

    expect(result.current.weather).toBeNull()
    expect(result.current.location).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle error without message', async () => {
    weatherApi.fetchWeatherData.mockRejectedValue({})
    weatherApi.reverseGeocode.mockResolvedValue({})

    const { result } = renderHook(() => useWeather())

    await act(async () => {
      await result.current.fetchWeather(35.6762, 139.6503)
    })

    expect(result.current.error).toBe('Failed to fetch weather')
  })

  it('should call APIs with correct coordinates', async () => {
    const lat = 40.7128
    const lng = -74.006

    weatherApi.fetchWeatherData.mockResolvedValue({ weatherCode: 0 })
    weatherApi.reverseGeocode.mockResolvedValue({})
    weatherApi.getWeatherDescription.mockReturnValue({ description: '', icon: '' })

    const { result } = renderHook(() => useWeather())

    await act(async () => {
      await result.current.fetchWeather(lat, lng)
    })

    expect(weatherApi.fetchWeatherData).toHaveBeenCalledWith(lat, lng)
    expect(weatherApi.reverseGeocode).toHaveBeenCalledWith(lat, lng)
  })

  it('should allow setting error manually', () => {
    const { result } = renderHook(() => useWeather())

    act(() => {
      result.current.setError('Custom error message')
    })

    expect(result.current.error).toBe('Custom error message')
  })
})
