"use client";

import { useState, useEffect, useRef } from "react";
import { Coffee, MessageCircle, Heart, Rocket, Star, Zap, Radio } from "lucide-react";

interface Dino {
  id: string;
  name: string;
  type: "rex" | "tricera" | "pteroda" | "bronto" | "mosa";
  emoji: string;
  x: number;
  y: number;
  status: "idle" | "working" | "meeting" | "sleeping";
  currentTask?: string;
  targetX?: number;
  targetY?: number;
  energy?: number;
}

const initialDinos: Dino[] = [
  { id: "1", name: "Rex", type: "rex", emoji: "🦖", x: 15, y: 40, status: "working", currentTask: "Building Mission Control", energy: 80 },
  { id: "2", name: "Tricera", type: "tricera", emoji: "🦕", x: 40, y: 40, status: "working", currentTask: "Designing UI", energy: 75 },
  { id: "3", name: "Pteroda", type: "pteroda", emoji: "🦅", x: 65, y: 25, status: "working", currentTask: "Researching", energy: 90 },
  { id: "4", name: "Bronto", type: "bronto", emoji: "🦒", x: 27, y: 65, status: "idle", energy: 60 },
  { id: "5", name: "Mosa", type: "mosa", emoji: "🐊", x: 57, y: 65, status: "working", currentTask: "Coding", energy: 85 },
];

// Pixel art SVGs for each dino - Space themed colors
const RexPixel = ({ isWorking, size = "normal" }: { isWorking: boolean; size?: "normal" | "small" }) => {
  const scale = size === "small" ? "w-[6%] h-auto min-w-[32px]" : "w-[10%] h-auto min-w-[48px]";
  return (
    <svg viewBox="0 0 48 48" className={`${scale} drop-shadow-[0_0_15px_rgba(255,0,255,0.5)] aspect-square`}>
      {/* Space helmet effect with glow */}
      <rect x="12" y="18" width="24" height="18" fill="#ff00ff" />
      <rect x="14" y="6" width="20" height="14" fill="#ff00ff" />
      <rect x="26" y="10" width="4" height="4" fill="#000" />
      <rect x="27" y="8" width="2" height="2" fill="#fff" />
      <rect x="34" y="10" width="8" height="8" fill="#ff00ff" />
      <rect x="36" y="18" width="2" height="2" fill="#fff" />
      <rect x="40" y="18" width="2" height="2" fill="#fff" />
      <rect x="4" y="22" width="8" height="6" fill="#ff00ff" />
      <rect x="0" y="18" width="4" height="4" fill="#ff00ff" />
      <rect x="14" y="28" width="4" height="5" fill="#c026d3" className={isWorking ? "opacity-80" : ""} />
      <rect x="30" y="28" width="4" height="5" fill="#c026d3" className={isWorking ? "opacity-80" : ""} />
      <rect x="14" y="36" width="6" height="8" fill="#c026d3" />
      <rect x="28" y="36" width="6" height="8" fill="#c026d3" />
      {/* Space helmet glass reflection */}
      <rect x="14" y="6" width="20" height="4" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
};

const TriceraPixel = ({ isWorking, size = "normal" }: { isWorking: boolean; size?: "normal" | "small" }) => {
  const scale = size === "small" ? "w-[6%] h-auto min-w-[32px]" : "w-[10%] h-auto min-w-[48px]";
  return (
    <svg viewBox="0 0 48 48" className={`${scale} drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] aspect-square`}>
      <rect x="10" y="20" width="28" height="16" rx="3" fill="#8b5cf6" />
      <ellipse cx="24" cy="18" rx="18" ry="12" fill="#7c3aed" />
      <ellipse cx="24" cy="18" rx="14" ry="9" fill="#8b5cf6" />
      <rect x="18" y="8" width="12" height="12" rx="2" fill="#8b5cf6" />
      <polygon points="10,10 6,2 14,8" fill="#00ffff" />
      <polygon points="38,10 42,2 34,8" fill="#00ffff" />
      <polygon points="24,8 22,0 26,0" fill="#00ffff" />
      <circle cx="22" cy="14" r="2.5" fill="#000" />
      <circle cx="23" cy="13" r="1" fill="#fff" />
      <rect x="26" y="16" width="8" height="6" rx="1" fill="#7c3aed" />
      <rect x="4" y="24" width="6" height="4" fill="#8b5cf6" />
      <rect x="16" y="30" width="3" height="5" fill="#6d28d9" className={isWorking ? "opacity-90" : ""} />
      <rect x="29" y="30" width="3" height="5" fill="#6d28d9" className={isWorking ? "opacity-90" : ""} />
      <rect x="14" y="36" width="6" height="8" rx="1" fill="#7c3aed" />
      <rect x="28" y="36" width="6" height="8" rx="1" fill="#7c3aed" />
      {/* Nebula glow effect */}
      <ellipse cx="24" cy="18" rx="20" ry="14" fill="url(#nebulaGlow)" opacity="0.3" />
      <defs>
        <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const PterodaPixel = ({ isWorking, size = "normal" }: { isWorking: boolean; size?: "normal" | "small" }) => {
  const scale = size === "small" ? "w-[6%] h-auto min-w-[32px]" : "w-[10%] h-auto min-w-[48px]";
  return (
    <svg viewBox="0 0 48 48" className={`${scale} drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] aspect-square`}>
      {/* Wings - neon cyan */}
      <path d="M4 24 L20 16 L20 28 Z" fill="#00ffff" className={isWorking ? "opacity-70" : ""} />
      <path d="M44 24 L28 16 L28 28 Z" fill="#00ffff" className={isWorking ? "opacity-70" : ""} />
      {/* Body */}
      <ellipse cx="24" cy="26" rx="8" ry="6" fill="#06b6d4" />
      {/* Head */}
      <ellipse cx="24" cy="16" rx="6" ry="5" fill="#06b6d4" />
      {/* Beak */}
      <polygon points="28,14 36,16 28,18" fill="#0891b2" />
      {/* Eye */}
      <circle cx="22" cy="15" r="1.5" fill="#000" />
      <circle cx="22.5" cy="14.5" r="0.5" fill="#fff" />
      {/* Crest - plasma pink */}
      <path d="M20 10 Q24 4 28 10" fill="#ff00ff" />
      {/* Tail */}
      <path d="M16 28 L8 32 L16 30" fill="#0891b2" />
      {/* Jet trail */}
      <circle cx="10" cy="28" r="1" fill="#00ffff" opacity="0.6" />
      <circle cx="6" cy="29" r="0.8" fill="#00ffff" opacity="0.4" />
    </svg>
  );
};

const BrontoPixel = ({ isWorking, size = "normal" }: { isWorking: boolean; size?: "normal" | "small" }) => {
  const scale = size === "small" ? "w-[6%] h-auto min-w-[32px]" : "w-[10%] h-auto min-w-[48px]";
  return (
    <svg viewBox="0 0 48 48" className={`${scale} drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] aspect-square`}>
      {/* Long neck - cosmic green */}
      <rect x="30" y="4" width="8" height="20" rx="2" fill="#22c55e" />
      {/* Head */}
      <ellipse cx="34" cy="6" rx="6" ry="5" fill="#22c55e" />
      {/* Eye */}
      <circle cx="36" cy="5" r="1.5" fill="#000" />
      <circle cx="36.5" cy="4.5" r="0.5" fill="#fff" />
      {/* Body - darker green */}
      <ellipse cx="20" cy="28" rx="16" ry="10" fill="#16a34a" />
      {/* Legs */}
      <rect x="12" y="36" width="4" height="8" rx="1" fill="#15803d" className={isWorking ? "animate-pulse" : ""} />
      <rect x="20" y="36" width="4" height="8" rx="1" fill="#15803d" className={isWorking ? "animate-pulse" : ""} />
      <rect x="28" y="36" width="4" height="8" rx="1" fill="#15803d" />
      {/* Tail */}
      <path d="M4 26 L0 28 L4 30" fill="#22c55e" />
      {/* Space scanner on head */}
      <rect x="33" y="0" width="2" height="4" fill="#00ffff" />
      <circle cx="34" cy="-1" r="1" fill="#ff00ff" className="opacity-60" />
    </svg>
  );
};

const MosaPixel = ({ isWorking, size = "normal" }: { isWorking: boolean; size?: "normal" | "small" }) => {
  const scale = size === "small" ? "w-[6%] h-auto min-w-[32px]" : "w-[10%] h-auto min-w-[48px]";
  return (
    <svg viewBox="0 0 48 48" className={`${scale} drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] aspect-square`}>
      {/* Body - cosmic orange */}
      <ellipse cx="24" cy="28" rx="14" ry="8" fill="#f97316" />
      {/* Head */}
      <ellipse cx="36" cy="22" rx="8" ry="5" fill="#f97316" />
      {/* Snout */}
      <rect x="42" y="20" width="6" height="4" fill="#ea580c" />
      {/* Eye */}
      <circle cx="38" cy="21" r="1.5" fill="#000" />
      <circle cx="38.5" cy="20.5" r="0.5" fill="#fff" />
      {/* Fins - neon */}
      <path d="M18 18 L22 8 L26 18" fill="#ff00ff" className={isWorking ? "opacity-80" : ""} />
      <path d="M30 18 L34 10 L38 18" fill="#00ffff" />
      {/* Tail */}
      <path d="M10 28 L0 24 L10 32" fill="#f97316" />
      {/* Flippers */}
      <rect x="18" y="32" width="4" height="6" rx="1" fill="#ea580c" />
      <rect x="26" y="32" width="4" height="6" rx="1" fill="#ea580c" />
      {/* Laser eye beam */}
      {isWorking && (
        <line x1="44" y1="21" x2="60" y2="21" stroke="#ff0000" strokeWidth="1" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="0.5s" repeatCount="indefinite" />
        </line>
      )}
    </svg>
  );
};

const SpaceStation = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full">
    {/* Main hub */}
    <circle cx="60" cy="40" r="20" fill="#1e1e3f" stroke="#00ffff" strokeWidth="2" />
    <circle cx="60" cy="40" r="12" fill="#0a0a1a" />
    {/* Docking ports */}
    <rect x="35" y="35" width="10" height="10" rx="2" fill="#2d2d5a" stroke="#ff00ff" strokeWidth="1" />
    <rect x="75" y="35" width="10" height="10" rx="2" fill="#2d2d5a" stroke="#ff00ff" strokeWidth="1" />
    <rect x="55" y="15" width="10" height="10" rx="2" fill="#2d2d5a" stroke="#ff00ff" strokeWidth="1" />
    <rect x="55" y="55" width="10" height="10" rx="2" fill="#2d2d5a" stroke="#ff00ff" strokeWidth="1" />
    {/* Solar panels */}
    <rect x="10" y="30" width="20" height="20" fill="#1e3a5f" stroke="#00ffff" strokeWidth="1" opacity="0.8" />
    <line x1="15" y1="30" x2="15" y2="50" stroke="#00ffff" strokeWidth="0.5" opacity="0.5" />
    <line x1="20" y1="30" x2="20" y2="50" stroke="#00ffff" strokeWidth="0.5" opacity="0.5" />
    <line x1="25" y1="30" x2="25" y2="50" stroke="#00ffff" strokeWidth="0.5" opacity="0.5" />
    <rect x="90" y="30" width="20" height="20" fill="#1e3a5f" stroke="#00ffff" strokeWidth="1" opacity="0.8" />
    {/* Blinking lights - slower for eye comfort */}
    <circle cx="60" cy="40" r="2" fill="#ff0000" opacity="0.7" />
    <circle cx="40" cy="40" r="1.5" fill="#00ff00" opacity="0.7" />
    <circle cx="80" cy="40" r="1.5" fill="#00ff00" opacity="0.7" />
  </svg>
);

const SpaceDesk = () => (
  <svg viewBox="0 0 80 60" className="w-full h-full">
    {/* Anti-gravity desk */}
    <ellipse cx="40" cy="35" rx="35" ry="8" fill="#2d2d5a" stroke="#00ffff" strokeWidth="1" />
    <ellipse cx="40" cy="33" rx="30" ry="6" fill="#1e1e3f" />
    {/* Holographic screen */}
    <rect x="28" y="8" width="24" height="18" rx="2" fill="none" stroke="#ff00ff" strokeWidth="1" opacity="0.8" />
    <rect x="30" y="10" width="20" height="14" rx="1" fill="rgba(255,0,255,0.1)" />
    <line x1="32" y1="14" x2="48" y2="14" stroke="#ff00ff" strokeWidth="0.5" opacity="0.6" />
    <line x1="32" y1="17" x2="44" y2="17" stroke="#ff00ff" strokeWidth="0.5" opacity="0.6" />
    <line x1="32" y1="20" x2="46" y2="20" stroke="#ff00ff" strokeWidth="0.5" opacity="0.6" />
    {/* Energy field base */}
    <ellipse cx="40" cy="45" rx="25" ry="4" fill="url(#energyField)" opacity="0.5" />
    <defs>
      <radialGradient id="energyField" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Floating holo-keyboard */}
    <rect x="25" y="42" width="30" height="4" rx="1" fill="#1e1e3f" stroke="#00ffff" strokeWidth="0.5" opacity="0.7" />
    {/* Status orb */}
    <circle cx="68" cy="24" r="4" fill="#4ade80" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const StarField = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);
  
  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 8,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const GalaxyNebula = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Purple nebula */}
    <div 
      className="absolute w-[60%] h-[40%] rounded-full opacity-20"
      style={{
        background: "radial-gradient(ellipse at center, #8b5cf6 0%, transparent 70%)",
        left: "10%",
        top: "20%",
        filter: "blur(40px)",
      }}
    />
    {/* Pink plasma cloud */}
    <div 
      className="absolute w-[50%] h-[50%] rounded-full opacity-15"
      style={{
        background: "radial-gradient(ellipse at center, #ff00ff 0%, transparent 70%)",
        right: "5%",
        bottom: "10%",
        filter: "blur(50px)",
      }}
    />
    {/* Cyan aurora */}
    <div 
      className="absolute w-[80%] h-[30%] opacity-10"
      style={{
        background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
        left: "10%",
        top: "60%",
        filter: "blur(30px)",
      }}
    />
  </div>
);

const DinoComponent = ({ dino, isWorking }: { dino: Dino; isWorking: boolean }) => {
  switch (dino.type) {
    case "rex": return <RexPixel isWorking={isWorking} />;
    case "tricera": return <TriceraPixel isWorking={isWorking} />;
    case "pteroda": return <PterodaPixel isWorking={isWorking} />;
    case "bronto": return <BrontoPixel isWorking={isWorking} />;
    case "mosa": return <MosaPixel isWorking={isWorking} />;
    default: return <RexPixel isWorking={isWorking} />;
  }
};

export default function Office() {
  const [dinos, setDinos] = useState<Dino[]>(initialDinos);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Smooth animation using requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      setDinos((prev) =>
        prev.map((dino) => {
          if (dino.status === "idle" && dino.targetX !== undefined && dino.targetY !== undefined) {
            const dx = (dino.targetX - dino.x) * 0.02;
            const dy = (dino.targetY - dino.y) * 0.02;
            
            const newX = dino.x + dx;
            const newY = dino.y + dy;
            
            // Check if reached target
            const reachedTarget = Math.abs(dino.targetX - newX) < 0.5 && Math.abs(dino.targetY - newY) < 0.5;
            
            return {
              ...dino,
              x: newX,
              y: newY,
              targetX: reachedTarget ? undefined : dino.targetX,
              targetY: reachedTarget ? undefined : dino.targetY,
            };
          }
          return dino;
        })
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Set new targets for idle dinos periodically - sleeping dinos don't move
  useEffect(() => {
    const interval = setInterval(() => {
      setDinos((prev) =>
        prev.map((dino) => {
          if (dino.status === "idle" && dino.targetX === undefined) {
            return {
              ...dino,
              targetX: Math.max(10, Math.min(80, dino.x + (Math.random() - 0.5) * 20)),
              targetY: Math.max(20, Math.min(70, dino.y + (Math.random() - 0.5) * 15)),
            };
          }
          return dino;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Energy depletion - working dinos lose energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      setDinos((prev) =>
        prev.map((dino) => {
          if (dino.status === "working") {
            const newEnergy = Math.max(0, (dino.energy || 100) - 5);
            // Auto sleep when energy is low
            if (newEnergy <= 20 && newEnergy > 0) {
              return { ...dino, energy: newEnergy, status: "sleeping" };
            }
            return { ...dino, energy: newEnergy };
          } else if (dino.status === "sleeping") {
            const newEnergy = Math.min(100, (dino.energy || 0) + 10);
            // Wake up when fully rested
            if (newEnergy >= 100) {
              return { ...dino, energy: newEnergy, status: "idle" };
            }
            return { ...dino, energy: newEnergy };
          }
          return dino;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Recharge function - click button to heal all dinos
  const handleRecharge = () => {
    setDinos((prev) =>
      prev.map((dino) => ({
        ...dino,
        energy: 100,
        status: dino.status === "sleeping" ? "idle" : dino.status,
      }))
    );
    
    // Spawn hearts for all dinos
    dinos.forEach((dino) => {
      setTimeout(() => {
        const id = Date.now() + Math.random();
        setHearts((prev) => [...prev, { id, x: dino.x, y: dino.y - 10 }]);
        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== id));
        }, 4000);
      }, Math.random() * 500);
    });
  };

  useEffect(() => {
    const heartInterval = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * 70 + 15;
      const y = Math.random() * 40 + 20;
      setHearts((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 6000); // Slower heart animation for eye comfort
    }, 8000);

    return () => clearInterval(heartInterval);
  }, []);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tighter flex items-center gap-3">
          <Rocket className="text-[#ff00ff]" size={32} />
          Space Dino Command
        </h1>
        <p className="text-[#8a8a95]">The elite space dinosaur squadron on a mission to the stars! 🚀✨</p>
      </header>

      <div className="bg-[#15151a] border border-[#0066ff]/20 rounded-2xl p-4 md:p-6 overflow-hidden">
        {/* Space Office - responsive container */}
        <div className="relative w-full aspect-[16/10] min-h-[400px] bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3a] to-[#0f0f1f] rounded-xl overflow-hidden">
          
          {/* Star field */}
          <StarField />
          
          {/* Nebula effects */}
          <GalaxyNebula />
          
          {/* Space scanline overlay */}
          <div className="absolute inset-0 space-scanline" />
          
          {/* Distant galaxy */}
          <div className="absolute top-[10%] right-[15%] opacity-30">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#8b5cf6] blur-xl" />
          </div>
          
          {/* Space station in background */}
          <div className="absolute top-[15%] left-[5%] w-20 h-14 opacity-60">
            <SpaceStation />
          </div>
          
          {/* Second space station */}
          <div className="absolute bottom-[25%] right-[3%] w-16 h-10 opacity-40">
            <SpaceStation />
          </div>
          
          {/* Title badge */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
            <div className="flex items-center gap-2 text-[#00ffff]/80 bg-[#0a0a1a]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#00ffff]/30">
              <Radio size={16} className="text-[#ff00ff]" />
              <span className="text-xs md:text-sm font-medium">Space Station Alpha v2.0</span>
            </div>
          </div>
          
          {/* Mission timer */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
            <div className="flex items-center gap-2 text-[#f97316] bg-[#0a0a1a]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#f97316]/30">
              <Zap size={14} />
              <span className="text-xs font-mono">T-MINUS 04:20:69</span>
            </div>
          </div>
          
          {/* Floating hearts */}
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute animate-bounce"
              style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
            >
              <Heart size={14} className="text-[#ff00ff] fill-[#ff00ff]" />
            </div>
          ))}
          
          {/* Space desks - positioned by percentage for responsiveness */}
          <div className="absolute w-[14%] aspect-[4/3]" style={{ left: "8%", top: "45%" }}>
            <SpaceDesk />
          </div>
          <div className="absolute w-[14%] aspect-[4/3]" style={{ left: "33%", top: "45%" }}>
            <SpaceDesk />
          </div>
          <div className="absolute w-[14%] aspect-[4/3]" style={{ left: "58%", top: "45%" }}>
            <SpaceDesk />
          </div>
          <div className="absolute w-[14%] aspect-[4/3]" style={{ left: "20%", top: "70%" }}>
            <SpaceDesk />
          </div>
          <div className="absolute w-[14%] aspect-[4/3]" style={{ left: "50%", top: "70%" }}>
            <SpaceDesk />
          </div>
          
          {/* Recharge station */}
          <div className="absolute right-[5%] bottom-[5%]">
            <button 
              onClick={handleRecharge}
              className="w-[8%] aspect-square min-w-[40px] bg-[#1a1a3a] border-2 border-[#ff00ff] rounded-full flex flex-col items-center justify-center hover:bg-[#2d2d5a] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,0,255,0.3)]"
            >
              <Coffee size={16} className="text-[#ff00ff] mb-0.5 w-[40%] h-auto" />
              <span className="text-[8px] text-[#8b5cf6]">Recharge</span>
            </button>
          </div>
          
          {/* Comms array */}
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ffff]/20 rounded-full border border-[#00ffff]/50 backdrop-blur-sm">
              <MessageCircle size={12} className="text-[#00ffff]" />
              <span className="text-xs text-[#00ffff]">Space Comms Online</span>
            </div>
          </div>

          {/* Dinos - positioned by percentage, centered with smooth transitions */}
          {dinos.map((dino) => (
            <div
              key={dino.id}
              className="absolute flex justify-center transition-all duration-300 ease-out"
              style={{
                left: `${dino.x}%`,
                top: dino.status === "working" ? (dino.y > 50 ? "68%" : "38%") : dino.status === "sleeping" ? "75%" : `${dino.y}%`,
                transform: "translateX(-50%)",
                opacity: dino.status === "sleeping" ? 0.7 : 1,
              }}
            >
              <div className="flex flex-col items-center">
                <DinoComponent dino={dino} isWorking={dino.status === "working"} />
                
                {/* Energy bar for all dinos */}
                <div className="mt-1 flex items-center gap-1">
                  <div className="w-6 h-1 bg-[#1a1a3a] rounded-full overflow-hidden border border-[#8b5cf6]/30">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${dino.energy || 0}%`,
                        backgroundColor: (dino.energy || 0) > 50 ? '#00ffff' : (dino.energy || 0) > 20 ? '#f97316' : '#ef4444'
                      }} 
                    />
                  </div>
                  <span className="text-[7px] text-[#8a8a95]">{dino.energy || 0}%</span>
                </div>
                
                {/* Working animation bar */}
                {dino.status === "working" && (
                  <div className="mt-0.5 flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-[#1a1a3a] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00ffff] to-[#ff00ff] animate-progress" />
                    </div>
                  </div>
                )}
                
                <div className="mt-1 px-2 py-0.5 bg-[#0a0a1a]/80 border border-[#8b5cf6]/50 rounded-full text-[9px] text-[#00ffff] whitespace-nowrap">
                  {dino.name} {dino.status === "idle" && "🌌"}
                  {dino.status === "working" && "🔥"}
                  {dino.status === "meeting" && "📡"}
                  {dino.status === "sleeping" && "💤"}
                </div>
                
                {dino.currentTask && dino.status === "working" && (
                  <div className="mt-1 px-2 py-0.5 bg-[#ff00ff]/20 border border-[#ff00ff]/30 rounded text-[8px] text-[#ff00ff] whitespace-nowrap max-w-[100px] truncate">
                    {dino.currentTask}
                  </div>
                )}
                
                {dino.status === "sleeping" && (
                  <div className="mt-1 px-2 py-0.5 bg-[#1a1a3a]/80 border border-[#8b5cf6]/30 rounded text-[8px] text-[#8a8a95] whitespace-nowrap">
                    Recharging...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend - all dinos */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-4 pt-4 border-t border-[#0066ff]/20">
          <div className="flex items-center gap-2">
            <RexPixel isWorking={false} size="small" />
            <span className="text-xs text-[#8a8a95]">Rex (Commander)</span>
          </div>
          <div className="flex items-center gap-2">
            <TriceraPixel isWorking={false} size="small" />
            <span className="text-xs text-[#8a8a95]">Tricera (Art Director)</span>
          </div>
          <div className="flex items-center gap-2">
            <PterodaPixel isWorking={false} size="small" />
            <span className="text-xs text-[#8a8a95]">Pteroda (Scout)</span>
          </div>
          <div className="flex items-center gap-2">
            <BrontoPixel isWorking={false} size="small" />
            <span className="text-xs text-[#8a8a95]">Bronto (Strategist)</span>
          </div>
          <div className="flex items-center gap-2">
            <MosaPixel isWorking={false} size="small" />
            <span className="text-xs text-[#8a8a95]">Mosa (Engineer)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
