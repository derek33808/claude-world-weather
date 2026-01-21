import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WeatherCard from './WeatherCard'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    circle: (props) => <circle {...props} />,
    line: (props) => <line {...props} />,
    path: (props) => <path {...props} />,
    g: ({ children, ...props }) => <g {...props}>{children}</g>
  }
}))

// Mock weatherApi
vi.mock('../services/weatherApi', () => ({
  getWeatherType: vi.fn((code) => {
    if (code === 0 || code === 1) return 'clear'
    if (code >= 51 && code <= 67) return 'rain'
    if (code >= 71 && code <= 77) return 'snow'
    if (code >= 95) return 'storm'
    return 'cloudy'
  })
}))

describe('WeatherCard', () => {
  const mockWeather = {
    temperature: 22.5,
    weatherCode: 1,
    windSpeed: 12.3,
    humidity: 65,
    isDay: true,
    description: 'Mainly clear',
    icon: 'sun'
  }

  const mockLocation = {
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503
  }

  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render location information', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Tokyo')).toBeInTheDocument()
    expect(screen.getByText('Japan')).toBeInTheDocument()
  })

  it('should display temperature in Celsius by default', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('23')).toBeInTheDocument() // Math.round(22.5)
    expect(screen.getByText(/°C/)).toBeInTheDocument()
  })

  it('should display temperature in Fahrenheit when unit is fahrenheit', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
        unit="fahrenheit"
      />
    )

    // 22.5 * 9/5 + 32 = 72.5, rounded = 73
    expect(screen.getByText('73')).toBeInTheDocument()
    expect(screen.getByText(/°F/)).toBeInTheDocument()
  })

  it('should display weather description', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Mainly clear')).toBeInTheDocument()
  })

  it('should display humidity', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('65%')).toBeInTheDocument()
    expect(screen.getByText('Humidity')).toBeInTheDocument()
  })

  it('should display wind speed', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText(/12\.3/)).toBeInTheDocument()
    expect(screen.getByText('Wind')).toBeInTheDocument()
  })

  it('should display coordinates', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('35.68, 139.65')).toBeInTheDocument()
  })

  it('should display Day when isDay is true', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Day')).toBeInTheDocument()
  })

  it('should display Night when isDay is false', () => {
    const nightWeather = { ...mockWeather, isDay: false }

    render(
      <WeatherCard
        weather={nightWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Night')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    render(
      <WeatherCard
        weather={mockWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    const closeButtons = screen.getAllByRole('button')
    fireEvent.click(closeButtons[0])

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should handle missing city gracefully', () => {
    const locationWithoutCity = {
      ...mockLocation,
      city: null
    }

    render(
      <WeatherCard
        weather={mockWeather}
        location={locationWithoutCity}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Unknown Location')).toBeInTheDocument()
  })

  it('should handle negative temperatures', () => {
    const coldWeather = { ...mockWeather, temperature: -15.3 }

    render(
      <WeatherCard
        weather={coldWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('-15')).toBeInTheDocument()
  })

  it('should convert negative Celsius to Fahrenheit correctly', () => {
    const coldWeather = { ...mockWeather, temperature: -10 }

    render(
      <WeatherCard
        weather={coldWeather}
        location={mockLocation}
        onClose={mockOnClose}
        unit="fahrenheit"
      />
    )

    // -10 * 9/5 + 32 = 14
    expect(screen.getByText('14')).toBeInTheDocument()
  })

  it('should handle zero temperature', () => {
    const zeroWeather = { ...mockWeather, temperature: 0 }

    render(
      <WeatherCard
        weather={zeroWeather}
        location={mockLocation}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
