'use client';

import TechCard from "./TechCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Team = () => {
  const techCards = [
    { title: "DevOps", color: "0 84% 64%" },
    { title: "AppDev", color: "45 96% 61%" },
    { title: "UI/UX", color: "154 66% 58%" },
    { title: "Web Dev", color: "209 83% 56%" },
    { title: "AI/ML", color: "0 84% 64%" },
  ];

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Load Avenir font */}
      <style jsx global>{`
        @font-face {
          font-family: 'Avenir LT Std';
          src: url('/fonts/AvenirLTStd-Black.otf') format('opentype');
          font-weight: 900;
          font-style: normal;
        }
      `}</style>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(#8b5cf6_1px,transparent_1px),linear-gradient(90deg,#8b5cf6_1px,transparent_1px)] bg-[length:40px_40px]" />


      <div className="relative z-10 max-w-7xl w-full">
        <div className="text-center mb-16 space-y-4">
          <h2 className="mb-[110px] text-[50px] uppercase tracking-[0.1em] text-gray-400 font-semibold">
            LEVEL 03
          </h2>
          <h1
            className="ml-[100px] mr-[100px] text-[110px] font-[900] leading-[100%] tracking-[0] text-white glitch-text"
            style={{ fontFamily: "'Avenir LT Std', sans-serif" }}
            data-text="Behind the Pixels"
          >
            Behind the Pixels
          </h1>
        </div>

        <div className="flex items-center justify-center gap-8 mb-20">
          <button 
            className="text-white/80 hover:text-white transition-colors p-2"
            onClick={() => console.log("Previous")}
          >
            <ChevronLeft size={32} strokeWidth={3} />
          </button>

          <div className="flex gap-6 items-center flex-wrap justify-center">
            {techCards.map((card) => (
              <TechCard
                key={card.title}
                title={card.title}
                color={card.color}
                onClick={() => console.log(`Selected: ${card.title}`)}
              />
            ))}
          </div>

          <button 
            className="text-white/80 hover:text-white transition-colors p-2"
            onClick={() => console.log("Next")}
          >
            <ChevronRight size={32} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
