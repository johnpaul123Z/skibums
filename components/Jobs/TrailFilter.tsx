"use client";

import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { useState } from "react";

type Difficulty = "all" | "green" | "blue" | "black";

export function TrailFilter() {
  const [selected, setSelected] = useState<Difficulty>("all");

  const filters: { id: Difficulty; label: string; symbol: string; color: string }[] = [
    { id: "all", label: "All Levels", symbol: "◆◆◆", color: "text-gray-300" },
    { id: "green", label: "Entry Level", symbol: "◆", color: "text-green-400" },
    { id: "blue", label: "Intermediate", symbol: "◆◆", color: "text-blue-400" },
    { id: "black", label: "Expert", symbol: "◆◆◆", color: "text-slate-900" },
  ];

  return (
    <div className="flex items-center gap-4 p-4 glass rounded-2xl backdrop-blur-xl">
      <Filter className="w-5 h-5 text-cyan-400" />
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(filter.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selected === filter.id
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <span className={`mr-2 ${filter.color}`}>{filter.symbol}</span>
            {filter.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
