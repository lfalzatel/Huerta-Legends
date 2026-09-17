"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface CoinBurstProps {
  isActive: boolean;
  onComplete?: () => void;
  count?: number;
}

export const CoinBurst: React.FC<CoinBurstProps> = ({
  isActive,
  onComplete,
  count = 12,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: Particle[] = Array.from({ length: count }).map(
        (_, i) => ({
          id: i,
          x: (Math.random() - 0.5) * 350,
          y: -150 - Math.random() * 200,
          scale: 0.8 + Math.random() * 0.6,
          rotation: Math.random() * 720 - 360,
        })
      );
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isActive, count, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: p.scale,
                opacity: [1, 1, 0],
                rotate: p.rotation,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute text-[#F2B33D] drop-shadow-[0_4px_0_#C1871F]"
            >
              <Coins className="w-10 h-10 stroke-[2.5]" />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
