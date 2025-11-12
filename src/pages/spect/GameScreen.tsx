import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";
import logo from "../assets/logo.png";
import { motion } from 'framer-motion';


const generateHints = () => {
  const n = Math.floor(Math.random() * 4) + 3;
  return Array.from({ length: n }, (_, i) => `https://picsum.photos/300?random=${i + 1}`);
};

export default function GameScreen() {
  const [level, setLevel] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [viewTime, setViewTime] = useState(10);
  const [showHints, setShowHints] = useState(true);
  const [hints, setHints] = useState<string[]>(generateHints());

  const TOTAL_CELLS = 52;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!showHints && viewTime === 0) {
      timer = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showHints, viewTime]);

  useEffect(() => {
    if (viewTime > 0 && showHints) {
      const timer = setTimeout(() => setViewTime(viewTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (viewTime === 0) {
      setShowHints(false);
    }
  }, [viewTime, showHints]);

  const timerColor =
    viewTime > 3 ? "text-green-500" : viewTime > 1 ? "text-orange-500" : "text-red-600";

  const displayedImages = showHints
    ? hints
    : Array.from({ length: TOTAL_CELLS }).map(() => logo);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center overflow-hidden">
      {/* En-tête compact */}
      <header className="w-full max-w-5xl flex justify-between items-center px-6 py-0.1 border-b border-gray-300">
        <div className="text-left space-y-1 w-1/4">
          <h2 className="text-sm font-semibold">Niveau {level}/10</h2>
          <Progress value={(level / 10) * 100} className="h-1 bg-gray-200" />
        </div>

        <div className="flex flex-col items-center space-y-0.5">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Timer className="w-4 h-4" />
            <span>{elapsedTime}s</span>
          </div>
          <div className={`font-semibold text-lg ${timerColor}`}>
            {viewTime > 0 ? `${viewTime}s` : "Fini"}
          </div>
        </div>

        <div className="flex flex-col items-center w-1/4">
            {/* Logo du jeu en rotation */}
            <motion.img
              src={logo}
              alt="Logo"
              className="w-20 h-20 mb-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <h1 className="mt-1 text-sm font-bold tracking-wide">Chasseurs des indices</h1>
          </div>
      </header>

      {/* Zone encadrée fixe */}
      <div className="w-[600px] h-[400px] border-2 border-gray-600 rounded-xl shadow-lg bg-gray-50 mt-4 overflow-hidden flex items-center justify-center">
        {showHints ? (
          <div
            className={`grid gap-2 ${
              hints.length <= 3
                ? "grid-cols-1"
                : hints.length <= 4
                ? "grid-cols-2"
                : hints.length <= 6
                ? "grid-cols-3"
                : "grid-cols-4"
            }`}
            style={{ width: "100%", height: "100%" }}
          >
            {hints.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-full h-full object-cover rounded"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-1 w-full h-full p-1">
            {displayedImages.map((src, i) => (
              <img key={i} src={src} className="w-full h-full object-cover" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
