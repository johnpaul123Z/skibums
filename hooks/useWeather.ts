"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;
  condition: string;
  snowDepth: number;
  resort: string;
}

// Mock weather data - in production, this would fetch from a real API
export function useWeather(resort: string = "Alpine Peak") {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    condition: "Snowing",
    snowDepth: 42,
    resort,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setWeather({
        temperature: Math.floor(Math.random() * 20) + 20,
        condition: ["Snowing", "Clear", "Cloudy", "Powder Day"][
          Math.floor(Math.random() * 4)
        ],
        snowDepth: Math.floor(Math.random() * 60) + 20,
        resort,
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [resort]);

  return { weather, loading };
}
