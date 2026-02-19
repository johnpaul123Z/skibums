"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, MapPin, Home, DollarSign, Filter, X, ChevronDown } from "lucide-react";

interface AdvancedSearchProps {
  onFilterChange: (filters: FilterState) => void;
  totalJobs: number;
  filteredCount: number;
}

export interface FilterState {
  searchQuery: string;
  state: string;
  resorts: string[];
  housing: boolean | null; // null = all, true = yes, false = no
  minSalary: number;
  maxSalary: number;
}

const STATE_RESORTS: Record<string, string[]> = {
  Colorado: ["Vail", "Breckenridge", "Beaver Creek", "Keystone", "Crested Butte", "Steamboat", "Winter Park", "Copper"],
  California: ["Heavenly", "Northstar", "Kirkwood", "Palisades Tahoe", "Mammoth", "Mammoth Mountain", "Big Bear", "Big Bear Mountain Resort", "Snow Valley"],
  Utah: ["Park City", "Deer Valley", "Deer Valley Resort", "Solitude", "Snowbird", "Brighton"],
  Montana: ["Big Sky"],
  Vermont: ["Stowe", "Okemo", "Mount Snow", "Stratton", "Sugarbush"],
  Washington: ["Stevens Pass", "Crystal Mountain", "Summit at Snoqualmie"],
  Idaho: ["Schweitzer", "Sun Valley Resort", "Sun Valley"],
  Wyoming: ["Jackson", "Jackson Hole", "Jackson Hole Mountain Resort"],
  Maine: ["Sugarloaf", "Sunday River"],
  NewHampshire: ["Loon Mountain", "Attitash", "Wildcat"],
  NewYork: ["Hunter"],
  Pennsylvania: ["Seven Springs", "Jack Frost"],
  WestVirginia: ["Snowshoe"],
  Michigan: ["Boyne Mountain"],
  Canada: ["Whistler", "Tremblant", "Blue Mountain", "Cypress Mountain"],
};

const ALL_RESORTS = Array.from(new Set(Object.values(STATE_RESORTS).flat())).sort();

export function AdvancedSearch({ onFilterChange, totalJobs, filteredCount }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    state: "",
    resorts: [],
    housing: null,
    minSalary: 0,
    maxSalary: 100000,
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: "",
      state: "",
      resorts: [],
      housing: null,
      minSalary: 0,
      maxSalary: 100000,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.searchQuery || 
    filters.state || 
    filters.resorts.length > 0 ||
    filters.housing !== null ||
    filters.minSalary > 0 ||
    filters.maxSalary < 100000;

  const activeFilterCount = [
    filters.searchQuery,
    filters.state,
    filters.resorts.length > 0,
    filters.housing !== null,
    filters.minSalary > 0,
    filters.maxSalary < 100000,
  ].filter(Boolean).length;

  const visibleResorts = filters.state && STATE_RESORTS[filters.state]
    ? STATE_RESORTS[filters.state]
    : ALL_RESORTS;

  const toggleResort = (resort: string) => {
    const exists = filters.resorts.includes(resort);
    const nextResorts = exists
      ? filters.resorts.filter((r) => r !== resort)
      : [...filters.resorts, resort];
    updateFilter("resorts", nextResorts);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 mb-8"
    >
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
            placeholder="Search jobs (e.g., Ski Instructor, Lift Operator...)"
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-lg"
          />
        </div>

        {/* Toggle Filters Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            showFilters
              ? "bg-cyan-500 text-white"
              : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </motion.button>

        {hasActiveFilters && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="px-6 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Clear
          </motion.button>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-3 text-center text-sm text-gray-400">
        Showing <span className="text-cyan-400 font-semibold">{filteredCount}</span> of{" "}
        <span className="text-white font-semibold">{totalJobs}</span> jobs
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* State Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    State
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => {
                      const nextState = e.target.value;
                      const allowed = nextState && STATE_RESORTS[nextState] ? STATE_RESORTS[nextState] : ALL_RESORTS;
                      const prunedResorts = filters.resorts.filter((r) => allowed.includes(r));
                      const nextFilters = { ...filters, state: nextState, resorts: prunedResorts };
                      setFilters(nextFilters);
                      onFilterChange(nextFilters);
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">All States</option>
                    <option value="Colorado" className="bg-slate-800">Colorado</option>
                    <option value="California" className="bg-slate-800">California</option>
                    <option value="Utah" className="bg-slate-800">Utah</option>
                    <option value="Montana" className="bg-slate-800">Montana</option>
                    <option value="Vermont" className="bg-slate-800">Vermont</option>
                    <option value="Washington" className="bg-slate-800">Washington</option>
                    <option value="Idaho" className="bg-slate-800">Idaho</option>
                    <option value="Wyoming" className="bg-slate-800">Wyoming</option>
                    <option value="Maine" className="bg-slate-800">Maine</option>
                    <option value="NewHampshire" className="bg-slate-800">New Hampshire</option>
                    <option value="NewYork" className="bg-slate-800">New York</option>
                    <option value="Pennsylvania" className="bg-slate-800">Pennsylvania</option>
                    <option value="WestVirginia" className="bg-slate-800">West Virginia</option>
                    <option value="Michigan" className="bg-slate-800">Michigan</option>
                    <option value="Canada" className="bg-slate-800">Canada</option>
                  </select>
                </div>

                {/* Housing Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4 text-green-400" />
                    Housing Provided
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFilter("housing", null)}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                        filters.housing === null
                          ? "bg-cyan-500 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => updateFilter("housing", true)}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                        filters.housing === true
                          ? "bg-green-500 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => updateFilter("housing", false)}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                        filters.housing === false
                          ? "bg-red-500 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Minimum Salary
                  </label>
                  <select
                    value={filters.minSalary}
                    onChange={(e) => updateFilter("minSalary", Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value={0} className="bg-slate-800">Any</option>
                    <option value={15} className="bg-slate-800">$15+/hour</option>
                    <option value={20} className="bg-slate-800">$20+/hour</option>
                    <option value={25} className="bg-slate-800">$25+/hour</option>
                    <option value={30} className="bg-slate-800">$30+/hour</option>
                    <option value={35000} className="bg-slate-800">$35K+/year</option>
                    <option value={50000} className="bg-slate-800">$50K+/year</option>
                  </select>
                </div>
              </div>

              {/* Resort Multi-Select */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Resorts (select multiple)
                </label>
                <div className="max-h-44 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {visibleResorts.map((resort) => {
                    const checked = filters.resorts.includes(resort);
                    return (
                      <label
                        key={resort}
                        className={`text-sm px-3 py-2 rounded-lg cursor-pointer transition ${
                          checked ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40" : "bg-white/5 text-gray-300 border border-transparent hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => toggleResort(resort)}
                        />
                        {resort}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <p className="text-sm text-gray-400 mb-3">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.searchQuery && (
                      <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-full text-sm flex items-center gap-2">
                        <Search className="w-3 h-3" />
                        "{filters.searchQuery}"
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-cyan-200"
                          onClick={() => updateFilter("searchQuery", "")}
                        />
                      </span>
                    )}
                    {filters.state && (
                      <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        State: {filters.state === "NewHampshire" ? "New Hampshire" : filters.state === "NewYork" ? "New York" : filters.state === "WestVirginia" ? "West Virginia" : filters.state}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-blue-200"
                          onClick={() => updateFilter("state", "")}
                        />
                      </span>
                    )}
                    {filters.resorts.length > 0 && (
                      <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        Resorts: {filters.resorts.length}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-indigo-100"
                          onClick={() => updateFilter("resorts", [])}
                        />
                      </span>
                    )}
                    {filters.housing !== null && (
                      <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2">
                        <Home className="w-3 h-3" />
                        Housing: {filters.housing ? "Yes" : "No"}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-green-200"
                          onClick={() => updateFilter("housing", null)}
                        />
                      </span>
                    )}
                    {filters.minSalary > 0 && (
                      <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-2">
                        <DollarSign className="w-3 h-3" />
                        ${filters.minSalary.toLocaleString()}+ min
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-green-200"
                          onClick={() => updateFilter("minSalary", 0)}
                        />
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
