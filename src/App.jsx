
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch weather information from OpenWeather API
  const fetchWeather = async (city) => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      if (!API_KEY) {
        throw new Error("API key missing. Check your .env file.");
      }

      // API request
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Weather not found");
      }

      // Store weather information
      setWeather({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        feelsLike: data.main.feels_like,
        wind: data.wind.speed * 3.6,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        timezone: data.timezone,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        time: new Date().toLocaleTimeString()
      });

      setSearch("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load Chennai weather when the website opens
  useEffect(() => {
    fetchWeather("Chennai");
  }, []);

  // Search city
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(search);
  };

  // Calculate selected city's local time
  const getLocalTime = () => {
    if (!weather) return "";

    return new Date(
      Date.now() + weather.timezone * 1000
    ).toISOString().slice(11, 19);
  };

  // Convert sunrise and sunset into local time
  const getCityTime = (timestamp) => {
    return new Date(
      (timestamp + weather.timezone) * 1000
    ).toISOString().slice(11, 16);
  };

  return (
    <div className="app">

      {/* Navigation Bar */}
      <header className="navbar">
        <h2>🌦️ WeatherNow</h2>
        <span>Live Weather Dashboard</span>
      </header>

      <main className="container">

        {/* Welcome Section */}
        <section className="welcome">
          <p className="small-heading">WEATHER INFORMATION</p>
          <h1>Discover the Weather</h1>
          <p>Check temperature and humidity in any city.</p>
        </section>

        {/* City Search */}
        <form className="search-box" onSubmit={handleSubmit}>
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search city name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <p className="message">Loading weather...</p>
        )}

        {/* Error */}
        {error && (
          <p className="error">{error}</p>
        )}

        {/* Weather Information */}
        {weather && !loading && (
          <>
            <section className="weather-card">

              {/* City Information */}
              <div className="location">
                <div>
                  <p className="label">CURRENT LOCATION</p>
                  <h2>📍 {weather.city}</h2>
                  <p>{weather.country}</p>
                </div>

                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  width="100"
                />
              </div>

              {/* Temperature */}
              <div className="temperature">
                <span className="thermometer">🌡️</span>

                <h1>{Math.round(weather.temperature)}°C</h1>

                <h3>{weather.description}</h3>

                <p>
                  Feels like {Math.round(weather.feelsLike)}°C
                </p>
              </div>

              {/* Weather Details */}
              <div className="weather-details">

                <div className="detail">
                  <span>💧</span>
                  <div>
                    <p>Humidity</p>
                    <h2>{weather.humidity}%</h2>
                  </div>
                </div>

                <div className="detail">
                  <span>🌬️</span>
                  <div>
                    <p>Wind Speed</p>
                    <h2>{weather.wind.toFixed(1)} km/h</h2>
                  </div>
                </div>

                <div className="detail">
                  <span>🌡️</span>
                  <div>
                    <p>Feels Like</p>
                    <h2>{Math.round(weather.feelsLike)}°C</h2>
                  </div>
                </div>

              </div>
            </section>

            {/* Local Weather Time */}
            <div className="weather-time">
              <span>🕒</span>
              <span>Local Time: {getLocalTime()}</span>
            </div>

            {/* Sunrise and Sunset */}
            <div className="sun-details">
              <div className="sun-card">
                <span>🌅</span>
                <div>
                  <p>Sunrise</p>
                  <h3>{getCityTime(weather.sunrise)}</h3>
                </div>
              </div>

              <div className="sun-card">
                <span>🌇</span>
                <div>
                  <p>Sunset</p>
                  <h3>{getCityTime(weather.sunset)}</h3>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Popular Cities */}
        <section className="cities">
          <h3>Popular Cities</h3>

          <div className="city-list">
            {[
              "Chennai",
              "Bangalore",
              "Mumbai",
              "Delhi",
              "London",
              "Tokyo"
            ].map((city) => (
              <button
                key={city}
                className="city-button"
                onClick={() => fetchWeather(city)}
                disabled={loading}
              >
                {city}
              </button>
            ))}
          </div>
        </section>

        {/* Last Updated */}
        {weather && (
          <p className="updated">
            Last updated on your device: {weather.time}
          </p>
        )}

      </main>

      <footer>
        WeatherNow © 2026 | Powered by OpenWeather
      </footer>

    </div>
  );
}

export default App;
