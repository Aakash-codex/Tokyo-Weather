# Tokyo Weather

A beautiful, real-time weather application for Tokyo, Japan with hyper-local weather data and world clock functionality.

## Features

- **Real-time Weather Data**: Displays current temperature, humidity, wind speed, pressure, visibility, UV index, sunrise/sunset times
- **Weather Animations**: Dynamic particle effects for different weather conditions (rain, snow, sun, clouds, thunderstorm, mist)
- **World Clock**: Add and track multiple city clocks with real-time updates
- **Bilingual Support**: Toggle between English and Japanese (日本語)
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Hourly & Daily Forecasts**: Interactive charts showing 24-hour temperature and rain probability
- **Smart Tips**: Weather-specific suggestions for activities and preparations
- **Beautiful UI**: Modern glassmorphism design with weather-themed gradients

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Canvas API** - Weather particle animations
- **CSS** - Styling with glassmorphism effects

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

- Click the weather change button to cycle through different weather conditions
- Use the language toggle (top-right) to switch between English and Japanese
- Add cities to the world clock using the search bar
- Toggle temperature units with the °C/°F button
- Switch between hourly and daily forecast views using the tabs

## Project Structure

- `src/App.jsx` - Main application component
- `src/index.css` - Global styles
- `public/` - Static assets

## License

MIT
