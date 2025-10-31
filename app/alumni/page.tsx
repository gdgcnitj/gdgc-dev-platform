"use client";

import Image, { StaticImageData } from "next/image";

import AlumniCard from "@/components/alumni-card";
import searchIcon from "@/app/assets/search.png";
import filterIcon from "@/app/assets/filter.png";
import karanImage from "@/app/assets/karanSir.png";
import arnavImage from "@/app/assets/arnavSir.png";
import arushiImage from "@/app/assets/ArushiMam.png";
import joyjeetImage from "@/app/assets/joyjeetSir.png";
import deepakImage from "@/app/assets/deepakSir.png";
import himanshuImage from "@/app/assets/himanshuSir.png";

type Alumni = {
  id: string;
  name: string;
  role: string;
  imageUrl: string | StaticImageData;
  color: string; 
};

const ALUMNI: Alumni[] = [
  {
    id: "karandeep",
    name: "Karandeep Singh",
    role: "The ex-lead of gdg chapter 24-25",
    imageUrl: karanImage,
    color: "bg-[#FDD568]",
  },
  {
    id: "arnav",
    name: "Arnav Anand",
    role: "the pookiest ui/ux lead ever",
    imageUrl: arnavImage,
    color: "bg-[#69A6FC]",
  },
  {
    id: "arushi",
    name: "Arushi Gupta",
    role: "the begining of wit community",
    imageUrl: arushiImage,
    color: "bg-[#28D781]",
  },
  {
    id: "joyjeet",
    name: "Joyjeet Banerjee",
    role: "Talk to him about futures first",
    imageUrl: joyjeetImage,
    color: "bg-[#FF6A66]",
  },
  {
    id: "deepak",
    name: "Deepak Kumar",
    role: "devsecops or optum, hes the guy",
    imageUrl: deepakImage,
    color: "bg-[#FDD568]",
  },
  {
    id: "himanshu",
    name: "Himanshu Dania",
    role: "take ms interview tips",
    imageUrl: himanshuImage,
    color: "bg-[#69A6FC]",
  },
];

export default function AlumniPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <section className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <header className="py-6 sm:py-8 md:py-10 lg:py-12">
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-red-hat-mono">
            We the People
          </h1>
          <div className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20">
            <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed font-normal font-red-hat-mono">
              We came here as strangers, we left as a family — and that family never really leaves. Our alumni carry the jokes that still make us laugh, the lessons that still guide us, and the dreams that still push us forward. This isn't just history, it's living proof that what we built together lasts far beyond the campus walls. This is the place where you can meet our alumni and see the journeys they continue to shape.
            </p>
            <div className="mt-6 sm:mt-8 md:mt-10 flex items-center justify-end">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <input
                    placeholder="Look for someone special"
                    className="w-64 sm:w-72 md:w-80 lg:w-96 h-8 sm:h-9 md:h-10 border-none bg-[#1C1C1C] pl-8 pr-3 sm:pl-10 sm:pr-4 py-2 text-sm sm:text-base text-white placeholder:text-white/70 outline-none focus:ring-2 focus:ring-white/30 font-red-hat-mono"
                    style={{ 
                      fontSize: '16px',
                      lineHeight: '100%',
                      letterSpacing: '-0.07em',
                      borderRadius: '40px'
                    }}
                    suppressHydrationWarning
                  />
                  <Image 
                    src={searchIcon} 
                    alt="Search" 
                    width={19} 
                    height={20} 
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none"
                  />
                </div>
                <button 
                  className="w-10 sm:w-12 md:w-14 h-8 sm:h-9 md:h-10 rounded-full bg-[#1C1C1C] border-0 flex items-center justify-center hover:bg-[#2C2C2C] transition-colors"
                  onClick={() => {
                    // Navigate to filter page
                    console.log('Navigate to filter page');
                  }}
                >
                  <Image 
                    src={filterIcon} 
                    alt="Filter" 
                    width={30} 
                    height={20} 
                    className="w-7 h-5"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[77px] px-4 sm:px-6 lg:px-8">
          {ALUMNI.map((a) => (
            <AlumniCard key={a.id} {...a} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 py-6 sm:py-8 md:py-10">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Go to page ${n}`}
              className="relative flex items-center justify-center rounded-full bg-white p-0 w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px] shrink-0"
              style={{
                opacity: 1,
                background: "#FFFFFF",
              }}
              // replace with your actual navigation handler (e.g. router.push)
              onClick={() => {
                /* navigate to page n */
              }}
            >
              {/* Gradient border using pseudo-element */}
              <div 
                className="absolute inset-0 rounded-full p-[3px]"
                style={{
                  background: "linear-gradient(137.77deg, #8EEBFF 10.19%, #28D781 37.77%, #F8FF1D 72.7%, #FF1717 97.98%)",
                }}
              >
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>
              <span className="relative z-10 font-red-hat-mono font-extrabold text-[18px] sm:text-[20px] md:text-[24px] leading-[100%] text-black">
                {n}
              </span>
            </button>
          ))}

          <div className="ml-2 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-white/90" />
            <span className="w-3 h-3 rounded-full bg-white/90" />
            <span className="w-3 h-3 rounded-full bg-white/90" />
          </div>
        </div>
      </section>
    </div>
  );
}
