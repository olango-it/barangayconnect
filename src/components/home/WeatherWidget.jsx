import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain,
  CloudSnow, CloudLightning, Wind, Droplets, MapPin, RefreshCw,
  Loader2, AlertCircle, Navigation, Thermometer, Clock,
} from "lucide-react";

// Open-Meteo is free and requires NO API key — nothing to hardcode or store in env vars.
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const REFRESH_MS = 10 * 60 * 1000; // auto-refresh every 10 minutes

// Default: Olango Island, Lapu-Lapu City (Barangay San Vicente)
const DEFAULT_LAT = 10.25;
const DEFAULT_LON = 124.0;
const DEFAULT_LABEL = "Olango Island, Lapu-Lapu City";

// WMO weather code → { label, Icon }
const WMO_CODES = {
  0: { label: "Clear sky", Icon: Sun },
  1: { label: "Mainly clear", Icon: Sun },
  2: { label: "Partly cloudy", Icon: CloudSun },
  3: { label: "Overcast", Icon: Cloud },
  45: { label: "Fog", Icon: CloudFog },
  48: { label: "Rime fog", Icon: CloudFog },
  51: { label: "Light drizzle", Icon: CloudDrizzle },
  53: { label: "Drizzle", Icon: CloudDrizzle },
  55: { label: "Dense drizzle", Icon: CloudDrizzle },
  56: { label: "Freezing drizzle", Icon: CloudDrizzle },
  57: { label: "Freezing drizzle", Icon: CloudDrizzle },
  61: { label: "Slight rain", Icon: CloudRain },
  63: { label: "Rain", Icon: CloudRain },
  65: { label: "Heavy rain", Icon: CloudRain },
  66: { label: "Freezing rain", Icon: CloudRain },
  67: { label: "Freezing rain", Icon: CloudRain },
  71: { label: "Slight snow", Icon: CloudSnow },
  73: { label: "Snow", Icon: CloudSnow },
  75: { label: "Heavy snow", Icon: CloudSnow },
  77: { label: "Snow grains", Icon: CloudSnow },
  80: { label: "Rain showers", Icon: CloudRain },
  81: { label: "Rain showers", Icon: CloudRain },
  82: { label: "Violent showers", Icon: CloudRain },
  85: { label: "Snow showers", Icon: CloudSnow },
  86: { label: "Snow showers", Icon: CloudSnow },
  95: { label: "Thunderstorm", Icon: CloudLightning },
  96: { label: "Thunderstorm", Icon: CloudLightning },
  99: { label: "Thunderstorm", Icon: CloudLightning },
};

const getWeatherInfo = (code) => WMO_CODES[code] || { label: "Unknown", Icon: Cloud };

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return "—";
  }
};

const formatDay = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
  } catch {
    return "—";
  }
};

export default function WeatherWidget() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(DEFAULT_LABEL);
  const [usingDefault, setUsingDefault] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });

  const fetchWeather = useCallback(async (lat, lon, label) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather service unavailable");
      const data = await res.json();

      // Reverse geocode for city name (free, no key)
      try {
        const geoRes = await fetch(`${GEOCODE_API}?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          const parts = [geo.city, geo.locality, geo.principalSubdivision].filter(Boolean);
          if (parts.length) label = parts.join(", ");
        }
      } catch { /* keep default label */ }

      setWeather(data);
      setLocation(label);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err.message || "Unable to load weather data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: try geolocation, fall back to default
  useEffect(() => {
    const init = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUsingDefault(false);
            setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            fetchWeather(pos.coords.latitude, pos.coords.longitude, "Your location");
          },
          () => {
            setUsingDefault(true);
            fetchWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_LABEL);
          },
          { timeout: 8000, maximumAge: 5 * 60 * 1000 }
        );
      } else {
        fetchWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_LABEL);
      }
    };
    init();
  }, [fetchWeather]);

  // Auto-refresh using stored coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeather(coords.lat, coords.lon, usingDefault ? DEFAULT_LABEL : location);
    }, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchWeather, coords, usingDefault, location]);

  const handleRefresh = () => {
    if (usingDefault) {
      fetchWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_LABEL);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, "Your location"),
        () => fetchWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_LABEL),
        { timeout: 8000 }
      );
    }
  };

  if (loading && !weather) {
    return (
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-xl border p-8 flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading weather…</span>
        </div>
      </section>
    );
  }

  if (error && !weather) {
    return (
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-xl border p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <span className="text-sm">{error}</span>
          <button onClick={handleRefresh} className="text-xs text-primary hover:underline flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Try again
          </button>
        </div>
      </section>
    );
  }

  const current = weather?.current;
  const daily = weather?.daily;
  const info = getWeatherInfo(current?.weather_code);
  const WeatherIcon = info.Icon;

  return (
    <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl shadow-xl border overflow-hidden"
      >
        {/* Header bar */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[200px] sm:max-w-md">{location}</span>
            {usingDefault && <span className="text-[10px] opacity-70">(default)</span>}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="text-xs opacity-80 hover:opacity-100 flex items-center gap-1 transition-opacity"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="p-5 grid lg:grid-cols-2 gap-6">
          {/* Current weather */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <WeatherIcon className="w-12 h-12 text-primary" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold font-heading">
                  {Math.round(current?.temperature_2m ?? 0)}°
                </span>
                <span className="text-sm text-muted-foreground">C</span>
              </div>
              <p className="text-sm font-medium">{info.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Feels like {Math.round(current?.apparent_temperature ?? 0)}°C
              </p>
            </div>
          </div>

          {/* Weather details */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl py-3">
              <Droplets className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-lg font-semibold">{current?.relative_humidity_2m ?? "—"}%</span>
              <span className="text-[10px] text-muted-foreground">Humidity</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl py-3">
              <Wind className="w-5 h-5 text-teal-500 mb-1" />
              <span className="text-lg font-semibold">{current?.wind_speed_10m ?? "—"}</span>
              <span className="text-[10px] text-muted-foreground">km/h wind</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl py-3">
              <Thermometer className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-lg font-semibold">{Math.round(current?.apparent_temperature ?? 0)}°</span>
              <span className="text-[10px] text-muted-foreground">Feels</span>
            </div>
          </div>
        </div>

        {/* 5-day forecast */}
        {daily && (
          <div className="px-5 pb-5">
            <div className="grid grid-cols-5 gap-2">
              {daily.time?.slice(0, 5).map((date, i) => {
                const dayInfo = getWeatherInfo(daily.weather_code?.[i]);
                const DayIcon = dayInfo.Icon;
                return (
                  <div key={date} className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-muted/50 transition-colors">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {i === 0 ? "Today" : formatDay(date)}
                    </span>
                    <DayIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-semibold">{Math.round(daily.temperature_2m_max?.[i])}°</span>
                    <span className="text-[10px] text-muted-foreground">{Math.round(daily.temperature_2m_min?.[i])}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <div className="px-5 pb-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            Updated {formatTime(lastUpdated)}
            {usingDefault && " · Showing default location (Olango Island)"}
          </div>
        )}
      </motion.div>
    </section>
  );
}