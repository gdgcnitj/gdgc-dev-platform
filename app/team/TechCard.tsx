import { cn } from "@/lib/utils";

interface TechCardProps {
  title: string;
  color: string;
  onClick?: () => void;
}

const TechCard = ({ title, color, onClick }: TechCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-50 h-70 rounded-2xl font-bold text-lg",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:-translate-y-2",
        "hover:shadow-2xl",
        "flex items-center justify-center",
        "border-6 border-white"
      )}
      style={{ backgroundColor: `hsl(${color})` }}

    >
      <span className="relative z-10 text-black drop-shadow-sm">
        {title}
      </span>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
    </button>
  );
};

export default TechCard;
