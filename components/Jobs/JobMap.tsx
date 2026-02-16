"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Job } from "@/components/Jobs/JobCard3D";
import { motion } from "framer-motion";
import { X, MapPin, Briefcase, Map } from "lucide-react";

// Mapbox token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface ResortLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  state: string;
  jobCount: number;
  jobs: Job[];
}

interface StateLocation {
  name: string;
  abbreviation: string;
  coordinates: [number, number]; // Center coordinates
  jobCount: number;
  jobs: Job[];
  resorts: string[];
}

interface JobMapProps {
  jobs: Job[];
}

// Resort coordinates - expanded for Vail + Alterra
const RESORT_COORDS: { [key: string]: [number, number] } = {
  // Vail Resorts (Epic Pass)
  "Beaver Creek": [-106.5165, 39.6042],
  "Vail": [-106.3742, 39.6403],
  "Breckenridge": [-106.0384, 39.4817],
  "Keystone": [-105.9347, 39.6042],
  "Park City": [-111.4980, 40.6461],
  "Heavenly": [-119.9413, 38.9352],
  "Northstar": [-120.1203, 39.2728],
  "Kirkwood": [-120.0659, 38.6836],
  "Crested Butte": [-106.9878, 38.8697],
  "Stevens Pass": [-121.0886, 47.7453],
  "Stowe": [-72.7834, 44.5305],
  "Okemo": [-72.7178, 43.4017],
  "Mount Snow": [-72.9203, 42.9603],
  "Hunter": [-74.2210, 42.2042],
  "Attitash": [-71.2517, 44.0853],
  "Wildcat": [-71.2203, 44.2628],
  "Mount Sunapee": [-72.0801, 43.3353],
  "Liberty": [-77.3489, 39.7423],
  "Seven Springs": [-79.2956, 40.0261],
  "Jack Frost": [-75.6478, 41.0614],
  "Whistler": [-122.9574, 50.1163],
  
  // Alterra Resorts (Ikon Pass)
  "Palisades Tahoe": [-120.2356, 39.1969],
  "Mammoth": [-119.0326, 37.6308],
  "June": [-119.0833, 37.7667],
  "Big Bear": [-116.9111, 34.2311],
  "Snow Valley": [-117.0447, 34.2153],
  "Steamboat": [-106.8175, 40.4850],
  "Winter Park": [-105.7625, 39.8867],
  "Deer Valley": [-111.4783, 40.6369],
  "Solitude": [-111.5914, 40.6197],
  "Crystal": [-121.4747, 46.9358],
  "Schweitzer": [-116.6228, 48.3678],
  "Blue Mountain": [-80.3208, 44.5000],
  "Tremblant": [-74.5833, 46.2097],
  "Stratton": [-72.9083, 43.1161],
  "Sugarbush": [-72.9019, 44.1358],
  "Snowshoe": [-79.9944, 38.4097],
  "Aspen": [-106.8175, 39.1911],
  "Jackson": [-110.8285, 43.5875],
  "CMH": [-117.5, 51.0],
  
  // Boyne Resorts
  "Big Sky": [-111.3005, 45.2846],
  "Boyne Mountain": [-84.9253, 45.1636],
  "Brighton": [-111.5828, 40.5986],
  "Cypress Mountain": [-123.2067, 49.3967],
  "Loon Mountain": [-71.6214, 44.0364],
  "Sugarloaf": [-70.3136, 45.0314],
  "Summit at Snoqualmie": [-121.4175, 47.4403],
  "Sunday River": [-70.8572, 44.4714],
  
  "default": [-110.0, 42.0], // Rocky Mountains center
};

// State center coordinates for state-level viewing
const STATE_CENTERS: { [key: string]: [number, number] } = {
  "Colorado": [-105.7821, 39.5501],
  "CO": [-105.7821, 39.5501],
  "Utah": [-111.0937, 39.3200],
  "UT": [-111.0937, 39.3200],
  "California": [-119.4179, 38.5816],
  "CA": [-119.4179, 38.5816],
  "Vermont": [-72.5778, 44.5588],
  "VT": [-72.5778, 44.5588],
  "Montana": [-110.3626, 46.8797],
  "MT": [-110.3626, 46.8797],
  "Wyoming": [-107.2903, 43.0760],
  "WY": [-107.2903, 43.0760],
  "Washington": [-121.4944, 47.7511],
  "WA": [-121.4944, 47.7511],
  "Idaho": [-114.7420, 44.0682],
  "ID": [-114.7420, 44.0682],
  "New Hampshire": [-71.5724, 43.1939],
  "NH": [-71.5724, 43.1939],
  "Maine": [-69.4455, 45.2538],
  "ME": [-69.4455, 45.2538],
  "New York": [-74.2179, 42.1497],
  "NY": [-74.2179, 42.1497],
  "Pennsylvania": [-77.1945, 40.8734],
  "PA": [-77.1945, 40.8734],
  "Maryland": [-77.4360, 39.0458],
  "MD": [-77.4360, 39.0458],
  "West Virginia": [-80.4549, 38.5976],
  "WV": [-80.4549, 38.5976],
  "Michigan": [-85.6024, 44.3148],
  "MI": [-85.6024, 44.3148],
  "British Columbia": [-122.9574, 50.1163],
  "BC": [-122.9574, 50.1163],
  "Quebec": [-74.5833, 46.2097],
  "QC": [-74.5833, 46.2097],
  "Ontario": [-80.3208, 44.5000],
  "ON": [-80.3208, 44.5000],
};

export function JobMap({ jobs }: JobMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedResort, setSelectedResort] = useState<ResortLocation | null>(null);
  const [selectedState, setSelectedState] = useState<StateLocation | null>(null);
  const [resortLocations, setResortLocations] = useState<ResortLocation[]>([]);
  const [stateLocations, setStateLocations] = useState<StateLocation[]>([]);

  useEffect(() => {
    // Group jobs by resort (improved matching)
    const resortMap = new Map<string, Job[]>();
    jobs.forEach((job) => {
      // Try to find matching key in RESORT_COORDS
      let matchedKey = job.resort;
      
      // Try exact match first
      if (RESORT_COORDS[job.resort]) {
        matchedKey = job.resort;
      } else {
        // Try partial matches
        const resortWords = job.resort.toLowerCase().split(' ');
        const coordKeys = Object.keys(RESORT_COORDS);
        
        for (const key of coordKeys) {
          const keyLower = key.toLowerCase();
          if (resortWords.some(word => keyLower.includes(word) || word.includes(keyLower))) {
            matchedKey = key;
            break;
          }
        }
      }
      
      if (!resortMap.has(matchedKey)) {
        resortMap.set(matchedKey, []);
      }
      resortMap.get(matchedKey)!.push(job);
    });

    // Create resort locations
    const locations: ResortLocation[] = Array.from(resortMap.entries()).map(
      ([name, jobs]) => ({
        name,
        coordinates: RESORT_COORDS[name] || RESORT_COORDS["default"],
        state: jobs[0]?.location.split(",")[1]?.trim() || "",
        jobCount: jobs.length,
        jobs,
      })
    );

    setResortLocations(locations);

    // Group jobs by state
    const stateMap = new Map<string, Job[]>();
    const stateResorts = new Map<string, Set<string>>();
    
    jobs.forEach((job) => {
      // Extract state from location (e.g., "Vail, CO" -> "CO")
      const locationParts = job.location.split(",");
      let state = locationParts[locationParts.length - 1]?.trim() || "";
      
      // Normalize state names
      if (state.length === 2) {
        // It's an abbreviation, that's fine
      } else {
        // Try to match full state name
        const stateMapping: { [key: string]: string } = {
          "Colorado": "CO",
          "Utah": "UT",
          "California": "CA",
          "Vermont": "VT",
          "Montana": "MT",
          "Wyoming": "WY",
          "Washington": "WA",
          "Idaho": "ID",
          "New Hampshire": "NH",
          "Maine": "ME",
          "New York": "NY",
          "Pennsylvania": "PA",
          "Maryland": "MD",
          "West Virginia": "WV",
          "Michigan": "MI",
          "British Columbia": "BC",
          "Quebec": "QC",
          "Ontario": "ON",
        };
        state = stateMapping[state] || state;
      }

      if (state) {
        if (!stateMap.has(state)) {
          stateMap.set(state, []);
          stateResorts.set(state, new Set());
        }
        stateMap.get(state)!.push(job);
        stateResorts.get(state)!.add(job.resort);
      }
    });

    const states: StateLocation[] = Array.from(stateMap.entries())
      .filter(([state]) => STATE_CENTERS[state]) // Only include states we have coordinates for
      .map(([state, jobs]) => ({
        name: state,
        abbreviation: state,
        coordinates: STATE_CENTERS[state],
        jobCount: jobs.length,
        jobs,
        resorts: Array.from(stateResorts.get(state) || []),
      }));

    setStateLocations(states);
  }, [jobs]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-110, 45], // Center on western US ski resorts
      zoom: 4,
      projection: { name: "mercator" } as any,
    });

    map.current.on("load", () => {
      // Add state markers (larger, different style)
      stateLocations.forEach((state) => {
        const stateEl = document.createElement("div");
        stateEl.className = "state-marker";
        stateEl.style.cssText = `
          padding: 8px 16px;
          background: linear-gradient(135deg, #8B5CF6, #6366F1);
          border: 3px solid white;
          border-radius: 12px;
          cursor: pointer;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
          transition: all 0.2s;
          white-space: nowrap;
        `;
        stateEl.innerHTML = `${state.abbreviation}<br/><span style="font-size: 10px;">${state.jobCount} jobs</span>`;
        
        stateEl.addEventListener("mouseenter", () => {
          stateEl.style.transform = "scale(1.15)";
          stateEl.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.8)";
        });
        stateEl.addEventListener("mouseleave", () => {
          stateEl.style.transform = "scale(1)";
          stateEl.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.6)";
        });
        stateEl.addEventListener("click", (e) => {
          e.stopPropagation();
          setSelectedState(state);
          setSelectedResort(null); // Close resort panel if open
        });

        new mapboxgl.Marker(stateEl)
          .setLngLat(state.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px; color: #8B5CF6;">${state.name}</h3>
                <p style="color: #00D2FF; margin-bottom: 4px;">${state.jobCount} total positions</p>
                <p style="font-size: 12px; color: #9CA3AF;">${state.resorts.length} resorts</p>
              </div>`
            )
          )
          .addTo(map.current!);
      });

      // Add markers for each resort
      resortLocations.forEach((resort) => {
        // Create custom marker element
        const el = document.createElement("div");
        el.className = "resort-marker";
        el.style.cssText = `
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #00D2FF, #0080FF);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 4px 12px rgba(0, 210, 255, 0.5);
          transition: transform 0.2s;
        `;
        el.textContent = resort.jobCount.toString();
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          // If only 1 job at this resort, open it directly
          if (resort.jobCount === 1 && resort.jobs[0]?.url) {
            window.open(resort.jobs[0].url, '_blank', 'noopener,noreferrer');
          } else {
            // Multiple jobs - show the panel
            setSelectedResort(resort);
            setSelectedState(null); // Close state panel if open
          }
        });

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(resort.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${resort.name}</h3>
                <p style="color: #00D2FF;">${resort.jobCount} positions available</p>
              </div>`
            )
          )
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [resortLocations, stateLocations]);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 glass-dark rounded-xl p-2 md:p-4 backdrop-blur-xl text-xs md:text-base max-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <Map className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
          <span className="text-white font-bold text-xs md:text-sm">Map Guide</span>
        </div>
        
        {/* State markers legend */}
        <div className="mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
            <div className="px-2 py-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded text-white text-[10px] font-bold">
              ST
            </div>
            <span>State (all jobs)</span>
          </div>
        </div>

        {/* Resort markers legend */}
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            #
          </div>
          <span>Resort jobs</span>
        </div>
      </div>

      {/* Selected State Panel */}
      {selectedState && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="absolute top-0 right-0 bottom-0 w-full md:w-96 glass-dark backdrop-blur-xl overflow-y-auto z-20"
        >
          <div className="p-4 md:p-6">
            {/* Close button */}
            <button
              onClick={() => setSelectedState(null)}
              className="absolute top-4 right-4 z-10 p-3 md:p-2 bg-red-500/80 hover:bg-red-500 md:bg-white/10 md:hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>

            <div className="mb-4 pr-12">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                  <Map className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {selectedState.name}
                </h2>
              </div>
              <p className="text-purple-400 text-sm md:text-base">
                {selectedState.resorts.length} resorts • {selectedState.jobCount} total positions
              </p>
            </div>

            <div className="space-y-3 pb-4">
              {selectedState.jobs.map((job) => (
                <motion.a
                  key={job.id}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="block p-4 md:p-5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-500/30 hover:border-purple-400/50 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 pr-2">
                      <h3 className="text-white font-bold text-base md:text-lg group-hover:text-purple-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-cyan-400 text-sm">{job.resort}</p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-purple-400 text-xl flex-shrink-0"
                    >
                      →
                    </motion.div>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mb-2">{job.type}</p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-green-400 text-xs md:text-sm font-mono font-semibold">
                      {job.salary}
                    </span>
                    {job.housing && (
                      <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                        🏠 Housing
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs md:text-sm text-purple-400 font-semibold group-hover:text-purple-300">
                    Tap to view & apply →
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected Resort Panel */}
      {selectedResort && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="absolute top-0 right-0 bottom-0 w-full md:w-96 glass-dark backdrop-blur-xl overflow-y-auto"
        >
          <div className="p-4 md:p-6">
            {/* Close button - more prominent on mobile */}
            <button
              onClick={() => setSelectedResort(null)}
              className="absolute top-4 right-4 z-10 p-3 md:p-2 bg-red-500/80 hover:bg-red-500 md:bg-white/10 md:hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6 md:w-5 md:h-5 text-white" />
            </button>

            <div className="mb-4 pr-12">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {selectedResort.name}
                </h2>
                <p className="text-cyan-400 text-sm md:text-base">{selectedResort.state}</p>
                <div className="flex items-center gap-2 mt-2 text-gray-300 text-sm">
                  <Briefcase className="w-4 h-4" />
                  <span>{selectedResort.jobCount} positions</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pb-4">
              {selectedResort.jobs.map((job) => (
                <motion.a
                  key={job.id}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="block p-4 md:p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl transition-all cursor-pointer group active:scale-98"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-base md:text-lg group-hover:text-cyan-400 transition-colors pr-2">
                      {job.title}
                    </h3>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-cyan-400 text-xl flex-shrink-0"
                    >
                      →
                    </motion.div>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mb-2">{job.type}</p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-green-400 text-xs md:text-sm font-mono font-semibold">
                      {job.salary}
                    </span>
                    {job.housing && (
                      <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                        🏠 Housing
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-xs md:text-sm text-cyan-400 font-semibold group-hover:text-cyan-300">
                    Tap to view & apply →
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading indicator */}
      {jobs.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white">Loading job map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
