"use client";

import { motion } from "framer-motion";

export function SnowflakeBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 2],
            opacity: [1, 0.8, 0],
            x: Math.cos((i * Math.PI * 2) / 12) * 50,
            y: Math.sin((i * Math.PI * 2) / 12) * 50,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
        />
      ))}
    </div>
  );
}
