import AngularBrackets from "@/components/ui/angular-brackets";
import Image from "next/image";
import instagram from "./assets/instagram.svg"
import twitter from "./assets/twitter.svg"
import youtube from "./assets/youtube.svg"
import linkedin from "./assets/linkedin.svg"
import github from "./assets/github.svg"
import { Red_Hat_Mono, Space_Grotesk } from "next/font/google";
import { Card } from "@/components/ui/card";
import FameCard from "@/components/ui/fame-card";
import hackmol from "./assets/hackmol.svg"
import mol from "./assets/mol.svg"
import gsc from "./assets/gsc.svg"
import Team from "./team/main_page"

const spaceGrotesk = Space_Grotesk({subsets:["latin"]})
const redHatMono = Red_Hat_Mono({subsets: ["latin"]})

export default function Home() {
  const dummyData = 
  [
    {
      title: "Hackmol",
      tag: "hackathon",
      description: "HackMOL is the flagship annual 30-hour hackathon being organized by Google Developer Student Club (GDSC) of NIT Jalandhar wherein young coders & developers from all over the country join together to build projects & solutions to the alarming problems of the region & the world.",
      color: "#FDD568",
      image: hackmol
    },
    {
      title: "Hackmol",
      tag: "hackathon",
      description: "HackMOL is the flagship annual 30-hour hackathon being organized by Google Developer Student Club (GDSC) of NIT Jalandhar wherein young coders & developers from all over the country join together to build projects & solutions to the alarming problems of the region & the world.",
      color: "#69A6FC",
      image: hackmol
    },
    {
      title: "Hackmol",
      tag: "hackathon",
      description: "HackMOL is the flagship annual 30-hour hackathon being organized by Google Developer Student Club (GDSC) of NIT Jalandhar wherein young coders & developers from all over the country join together to build projects & solutions to the alarming problems of the region & the world.",
      color: "#28D781",
      image: hackmol
    },
  ]
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <section className="flex flex-row justify-between">
          <div className="flex flex-col justify-center items-center relative group">
            <div className="relative flex justify-center items-center">
              <div className="relative z-[5]">
                <AngularBrackets color="#FFFFFF" />
              </div>
              <div className="absolute z-[4] translate-x-1 translate-y-1 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                <AngularBrackets color="#EA4335" />
              </div>
              <div className="absolute z-[3] translate-x-2 translate-y-2 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300">
                <AngularBrackets color="#34A853" />
              </div>
              <div className="absolute z-[2] translate-x-3 translate-y-3 group-hover:-translate-x-3 group-hover:-translate-y-3 transition-transform duration-300">
                <AngularBrackets color="#FBBC04" />
              </div>
              <div className="absolute z-[1] translate-x-4 translate-y-4 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-300">
                <AngularBrackets color="#4285F4" />
              </div>
            </div>
            <div className={`flex relative text-8xl font-bold ${spaceGrotesk.className}`}>
              <p className="relative text-white z-[5]">NITJ</p>
              <p className="absolute text-[#EA4335] translate-x-[4px] translate-y-[4px] z-[4] group-hover:-translate-x-1 group-hover:-translate-y-[4px] transition-transform duration-300">
                NITJ
              </p>
              <p className="absolute text-[#34A853] translate-x-[8px] translate-y-[8px] z-[3] group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300">
                NITJ
              </p>
              <p className="absolute text-[#FBBC04] translate-x-[12px] translate-y-[12px] z-[2] group-hover:-translate-x-3 group-hover:-translate-y-3 transition-transform duration-300">
                NITJ
              </p>
              <p className="absolute text-[#4285F4] translate-x-[16px] translate-y-[16px] z-[1] group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-300">
                NITJ
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end text-right justify-center max-w-[40%] font-bold gap-[66px]">
            <h1 className={`text-8xl ${spaceGrotesk.className}`}>
              We are <span className="text-[#EA4335]">G</span><span className="text-[#34A853]">D</span><span className="text-[#FBBC04]">G</span><span className="text-[#6DA4FC]">C</span> NITJ
            </h1>
            <p className={`text-2xl ${redHatMono.className}`}>
              We're not just another events club. At GDG NITJ, we're building a <span className="text-[#FBBC04]">community</span> where everyone is both a learner and a teacher. Our <span className="text-[#EA4335]">goal</span> is to create a dynamic environment for collective <span className="text-[#34A853]">growth</span>. We bring this <span className="text-[#6DA4FC]">vision</span> to life through high-energy flagship events like DevJams, Hackmol, and WomenTechies, along with tons of insightful workshops to keep you ahead of the curve.
            </p>
            <div className="flex gap-[36px]">
              <a href="https://www.instagram.com/gdgcnitj/" className="flex justify-center items-center hover:brightness-125 hover:bg-gray-400/10 rounded-full p-3">
                <Image src={instagram} width={40} height={40} alt="instagram"/>
              </a>
              <a href="https://x.com/GDSCNitj" className="flex justify-center items-center hover:brightness-125 hover:bg-gray-400/10 rounded-full p-3">
                <Image src={twitter} width={40} height={40} alt="twitter"/>
              </a>
              <a href="" className="flex justify-center items-center hover:brightness-125 hover:bg-gray-400/10 rounded-full p-3">
                <Image src={linkedin} width={40} height={40} alt="linkedin"/>
              </a>
              <a href="https://www.youtube.com/@DSCNITJ" className="flex justify-center items-center hover:brightness-125 hover:bg-gray-400/10 rounded-full p-3">
                <Image src={youtube} width={40} height={40} alt="youtube"/>
              </a>
              <a href="https://github.com/gdgcnitj" className="flex justify-center items-center hover:brightness-125 hover:bg-gray-400/10 rounded-full p-3">
                <Image className="brightness-95 contrast-95 invert-33 sepia-7 saturate-184 hue-rotate-169" src={github} width={40} height={40} alt="github"/>
              </a>
            </div>
          </div>
        </section>
        <section className="mt-20 flex w-full flex-col justify-center items-center">
          <h1 className={`flex justify-center items-center font-bold ${spaceGrotesk.className} text-8xl`}>WALL OF FAME</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full mx-auto justify-center place-items-center py-21 md:flex-row">
            {
              dummyData.map((d,i)=>(
                <FameCard title={d.title} color={d.color} description={d.description} tag={d.tag} image={d.image} key={i} />
              ))
            }
          </div>
        </section>
        <section className="flex w-full flex-col justify-center items-center">
          <Team></Team>
        </section>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        &copy; All rights reserved
        <a href="https://github.com/gdgcnitj"> GDGC NITJ</a>
      </footer>
    </div>
  );
}
