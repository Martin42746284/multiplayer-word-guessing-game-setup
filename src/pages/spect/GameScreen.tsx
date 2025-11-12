import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import hint1 from "../assets/hints/hint1.png";
import hint2 from "../assets/hints/hint2.png";
import hint3 from "../assets/hints/hint3.png";
import hint4 from "../assets/hints/hint4.png";
import hint5 from "../assets/hints/hint5.png";

export default function GameScreen() {
  const [level, setLevel] = useState(5); // exemple de niveau
  const [viewTime, setViewTime] = useState(10);
  const [showHints, setShowHints] = useState(true);

  // Charger uniquement les images correspondant au niveau
  const allHints = [hint1, hint2, hint3, hint4, hint5];
  const hints = allHints.slice(0, level);

  // Chrono de visionnage
  useEffect(() => {
    if (viewTime > 0 && showHints) {
      const timer = setTimeout(() => setViewTime(viewTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (viewTime === 0) {
      setShowHints(false);
    }
  }, [viewTime, showHints]);

  // Diviser les images en top row / bottom row
  const splitHints = (images: string[]) => {
    const mid = Math.ceil(images.length / 2);
    return [images.slice(0, mid), images.slice(mid)];
  };
  const [topRow, bottomRow] = splitHints(hints);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      {/* Logo du jeu en rotation */}
      <motion.img
        src={logo}
        alt="Logo"
        className="w-20 h-20 mb-6"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="w-full max-w-4xl">
        <AnimatePresence>
          {showHints ? (
            // Affichage des indices
            <motion.div
              key="hints"
              className="grid grid-rows-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 1.5 } }}
            >
              {/* Top row */}
              <div className="grid grid-cols-3 gap-4">
                {topRow.map((src, i) => (
                  <motion.div
                    key={i}
                    className="overflow-hidden rounded-lg border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={src} alt={`indice-${i}`} className="w-full h-32 object-cover" />
                  </motion.div>
                ))}
                {Array(3 - topRow.length).fill(0).map((_, i) => <div key={`empty-top-${i}`} />)}
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-3 gap-4">
                {bottomRow.map((src, i) => (
                  <motion.div
                    key={i}
                    className="overflow-hidden rounded-lg border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={src} alt={`indice-${i}`} className="w-full h-32 object-cover" />
                  </motion.div>
                ))}
                {Array(3 - bottomRow.length).fill(0).map((_, i) => <div key={`empty-bottom-${i}`} />)}
              </div>
            </motion.div>
          ) : (
            // Animation des images transformées en cases avec le logo
            <motion.div
              key="logo-grid"
              className="grid grid-rows-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...topRow, ...bottomRow, ...Array(6 - hints.length).fill(null)].map((_, i) => (
                <motion.div
                  key={i}
                  className="overflow-hidden rounded-lg border border-gray-700 flex items-center justify-center bg-gray-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <img src={logo} alt="logo" className="w-12 h-12" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}