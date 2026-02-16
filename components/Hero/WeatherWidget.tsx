"use client";

import { motion } from "framer-motion";
import { Snowflake, CloudSnow, Sun, Cloud } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

export function WeatherWidget() {
  const { weather, loading } = useWeather("Alpine Peak Resort");

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "Snowing":
        return <CloudSnow className="w-6 h-6" />;
      case "Clear":
        return <Sun className="w-6 h-6" />;
      case "Cloudy":
        return <Cloud className="w-6 h-6" />;
      case "Powder Day":
        return <Snowflake className="w-6 h-6" />;
      default:
        return <CloudSnow className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-4 w-64 animate-pulse">
        <div className="h-20 bg-white/10 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-4 backdrop-blur-xl w-48 md:w-64 shadow-xl"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-300 font-medium">
            {weather.resort}
          </p>
          <p className="text-3xl font-bold text-white mt-1">
            {weather.temperature}°F
          </p>
        </div>
        <motion.div
          animate={{
            rotate: weather.condition === "Powder Day" ? [0, 360] : 0,
          }}
          transition={{
            duration: 4,
            repeat: weather.condition === "Powder Day" ? Infinity : 0,
            ease: "linear",
          }}
          className="text-cyan-400"
        >
          {getWeatherIcon()}
        </motion.div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-300">
          <Snowflake className="w-4 h-4 text-cyan-400" />
          <span className="font-medium">{weather.snowDepth}"</span>
          <span className="text-xs">base</span>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            weather.condition === "Powder Day"
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white animate-pulse"
              : "bg-white/10 text-gray-200"
          }`}
        >
          {weather.condition}
        </div>
      </div>
    </motion.div>
  );
}
