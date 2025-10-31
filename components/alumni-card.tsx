import Image, { StaticImageData } from "next/image";

type Props = {
  id: string;
  name: string;
  role: string;
  imageUrl: string | StaticImageData;
  color: string;
};

export default function AlumniCard({ name, role, imageUrl, color }: Props) {
  return (
    <article 
      className={`${color} rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] border border-black shadow-sm transition-colors hover:shadow-lg flex flex-col w-full max-w-[280px] sm:max-w-[320px] md:max-w-[365px] mx-auto`}
      style={{ aspectRatio: '365/574' }}
    >
      {/* Top section with small rectangles and connect button */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 lg:px-6 pt-3 sm:pt-4 md:pt-5 lg:pt-6 pb-2 sm:pb-2.5 md:pb-3">
        <div className="flex gap-1 sm:gap-1.5 md:gap-2">
          <div className="w-8 sm:w-9 md:w-10 lg:w-12 h-4 sm:h-4.5 md:h-5 lg:h-6 bg-white rounded-full border border-black flex items-center justify-center">
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-black">MS</span>
          </div>
          <div className="w-8 sm:w-9 md:w-10 lg:w-12 h-4 sm:h-4.5 md:h-5 lg:h-6 bg-white rounded-full border border-black flex items-center justify-center">
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-black">IT</span>
          </div>
        </div>
        <button className="w-20 sm:w-22 md:w-24 lg:w-28 h-6 sm:h-6.5 md:h-7 lg:h-8 bg-black rounded-[20px] sm:rounded-[25px] md:rounded-[30px] border-2 border-black flex items-center justify-center hover:bg-gray-800 transition-colors">
          <span className="text-white text-[10px] sm:text-xs md:text-sm font-medium">Connect</span>
        </button>
      </div>

      {/* Name and Role */}
      <div className="px-3 sm:px-4 md:px-5 lg:px-6 pb-2 sm:pb-3 md:pb-3.5 lg:pb-4">
        <h3 
          className="text-black font-inter font-bold leading-tight mb-2 sm:mb-3 md:mb-4 lg:mb-5 w-[180px] sm:w-[200px] md:w-[241px] h-[80px] sm:h-[90px] md:h-[100px] lg:h-[116px] text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px]"
        >
          {name}
        </h3>
        <p className="text-[10px] sm:text-xs md:text-sm font-bold text-black leading-tight font-inter">
          {role}
        </p>
      </div>

      {/* Image - Positioned to touch right, bottom, and almost touch left borders */}
      <div className="flex-1 relative">
        <div 
          className="absolute border border-black overflow-hidden rounded-[30px] sm:rounded-[35px] md:rounded-[40px] lg:rounded-[50px]"
          style={{
            right: '0',
            bottom: '6px', // Responsive bottom spacing
            left: '3px', // Responsive left spacing
          }}
        >
          <Image
            src={imageUrl}
            alt={name}
            width={337}
            height={360}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </article>
  );
}