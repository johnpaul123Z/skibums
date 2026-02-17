"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Briefcase,
  TrendingUp,
  Home,
} from "lucide-react";
import { MountainButton } from "../UI/MountainButton";
import { SnowflakeBurst } from "../UI/SnowflakeBurst";

export interface Job {
  id: string;
  title: string;
  resort: string;
  location: string;
  salary: string;
  type: string;
  difficulty: number; // 1-3 (Green, Blue, Black diamond)
  image: string;
  featured?: boolean;
  url?: string; // Job application URL
  description?: string;
  requirements?: string[];
  benefits?: string[];
  company?: 'Vail' | 'Alterra' | 'Boyne' | 'Powdr';
  housing?: boolean; // Does this job provide housing?
}

interface JobCard3DProps {
  job: Job;
}

export function JobCard3D({ job }: JobCard3DProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Detect touch device on mount
  useState(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 600);
  };

  const getDifficultySymbol = (difficulty: number) => {
    const symbols = ["◆", "◆◆", "◆◆◆"];
    const colors = ["text-green-400", "text-blue-400", "text-slate-900"];
    return (
      <span className={`font-bold ${colors[difficulty - 1]}`}>
        {symbols[difficulty - 1]}
      </span>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={isTouchDevice ? undefined : handleMouseMove}
      onMouseLeave={isTouchDevice ? undefined : handleMouseLeave}
      style={isTouchDevice ? {} : {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={isTouchDevice ? {} : { scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full max-w-sm mx-auto"
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={isTouchDevice ? {} : {
          transformStyle: "preserve-3d",
          transform: "translateZ(50px)",
        }}
      >
        {/* Background Image with Parallax */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={job.image}
            alt={job.resort}
            className="w-full h-full object-cover"
            style={{
              transform: useTransform(
                [mouseXSpring, mouseYSpring],
                ([latestX, latestY]) =>
                  `scale(1.1) translateX(${(latestX as number) * 20}px) translateY(${(latestY as number) * 20}px)`
              ) as any,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          
          {/* Featured Badge */}
          {job.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              FEATURED
            </motion.div>
          )}

          {/* Favorite Button */}
          <motion.button
            onClick={handleFavorite}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorited
                ? "bg-red-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorited ? "currentColor" : "none"}
            />
            {showBurst && <SnowflakeBurst />}
          </motion.button>
        </div>

        {/* Card Content */}
        <div className="glass-dark p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
              <p className="text-cyan-400 font-semibold text-lg">{job.resort}</p>
            </div>
            <div className="text-right">
              {getDifficultySymbol(job.difficulty)}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
              {job.location}
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" />
              <span className="font-mono font-semibold">{job.salary}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <Clock className="w-4 h-4 mr-2 text-blue-400" />
              {job.type}
            </div>
            {job.housing && (
              <div className="flex items-center text-green-400 text-sm font-semibold">
                <Home className="w-4 h-4 mr-2" />
                Housing Provided
              </div>
            )}
            {job.company && (
              <div className="flex items-center text-gray-400 text-xs">
                <Briefcase className="w-3 h-3 mr-2" />
                {job.company === 'Vail' ? 'Epic Pass' : job.company === 'Alterra' ? 'Ikon Pass' : job.company === 'Powdr' ? 'Powdr' : 'Boyne'}
              </div>
            )}
          </div>

          <MountainButton
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              if (job.url) {
                window.open(job.url, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <Briefcase className="w-4 h-4" />
            Apply Now
          </MountainButton>
        </div>
      </div>
    </motion.div>
  );
}
