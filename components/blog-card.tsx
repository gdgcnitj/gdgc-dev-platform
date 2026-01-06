import Image, { StaticImageData } from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

type BlogCardProps = {
    id: string;
    title: string;
    playlist: string;
    image?: string | StaticImageData;
    description: string;
    date: string;
    likes: number;
    comments: number;
    author: string;
};

export default function BlogCard({
  title,
  description,
  playlist,
  date,
  likes,
  comments,
  author,
  id,
  image,
}: BlogCardProps) {
  return (
    <Link href={`/blogs/${id}`}>
        <div
    className="
      relative
      rounded-2xl
      p-[1.5px]
      bg-transparent
      transition-all
      duration-300
      hover:bg-[linear-gradient(90deg,_#f87171_0%,_#fde047_30%,_#4ade80_65%,_#60a5fa_100%)]
    "
  >

    <div
      className="
        w-full
        rounded-2xl
        bg-[#242526]
        px-6 py-5
        flex items-center justify-between
        gap-6
        hover:ring-white/20
        transition
      "
    >
      <div className="flex flex-col gap-2 max-w-[75%]">
        <p className="text-xs text-white/50">
          {playlist} by {" "}
          <span className="underline underline-offset-2">{author}</span>
        </p>

        <h2 className="text-2xl font-semibold text-white leading-tight">
          {title}
        </h2>

        <p className="text-sm text-white/70">{description}</p>

        <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
          <span>{date}</span>

          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{likes}</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{comments}</span>
          </div>
        </div>
      </div>

      {image != null? (
        <div className="shrink-0">
          <Image
        src={image}
        alt={title}
        width={120}
        height={90}
        className="rounded-lg bg-white"
          />
        </div>
      ) : null}
    </div>
</div>
    
    </Link>
  );
}
