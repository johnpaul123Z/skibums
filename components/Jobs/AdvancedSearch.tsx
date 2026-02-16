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
  location: string;
  housing: boolean | null; // null = all, true = yes, false = no
  minSalary: number;
  maxSalary: number;
}

export function AdvancedSearch({ onFilterChange, totalJobs, filteredCount }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    location: "",
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
      location: "",
      housing: null,
      minSalary: 0,
      maxSalary: 100000,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.searchQuery || 
    filters.location || 
    filters.housing !== null ||
    filters.minSalary > 0 ||
    filters.maxSalary < 100000;

  const activeFilterCount = [
    filters.searchQuery,
    filters.location,
    filters.housing !== null,
    filters.minSalary > 0,
    filters.maxSalary < 100000,
  ].filter(Boolean).length;

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
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Location / Resort
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => updateFilter("location", e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">All Locations</option>
                    <optgroup label="Colorado" className="bg-slate-800">
                      <option value="Vail" className="bg-slate-800">Vail</option>
                      <option value="Breckenridge" className="bg-slate-800">Breckenridge</option>
                      <option value="Beaver Creek" className="bg-slate-800">Beaver Creek</option>
                      <option value="Keystone" className="bg-slate-800">Keystone</option>
                      <option value="Steamboat" className="bg-slate-800">Steamboat</option>
                      <option value="Winter Park" className="bg-slate-800">Winter Park</option>
                    </optgroup>
                    <optgroup label="California" className="bg-slate-800">
                      <option value="Heavenly" className="bg-slate-800">Heavenly</option>
                      <option value="Mammoth" className="bg-slate-800">Mammoth</option>
                      <option value="Palisades" className="bg-slate-800">Palisades Tahoe</option>
                    </optgroup>
                    <optgroup label="Utah" className="bg-slate-800">
                      <option value="Park City" className="bg-slate-800">Park City</option>
                      <option value="Deer Valley" className="bg-slate-800">Deer Valley</option>
                      <option value="Brighton" className="bg-slate-800">Brighton</option>
                    </optgroup>
                    <optgroup label="Montana" className="bg-slate-800">
                      <option value="Big Sky" className="bg-slate-800">Big Sky</option>
                    </optgroup>
                    <optgroup label="Vermont" className="bg-slate-800">
                      <option value="Stowe" className="bg-slate-800">Stowe</option>
                      <option value="Okemo" className="bg-slate-800">Okemo</option>
                      <option value="Stratton" className="bg-slate-800">Stratton</option>
                      <option value="Sugarbush" className="bg-slate-800">Sugarbush</option>
                    </optgroup>
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
                    {filters.location && (
                      <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {filters.location}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-blue-200"
                          onClick={() => updateFilter("location", "")}
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
