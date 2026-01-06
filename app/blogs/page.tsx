"use client";

import { StaticImageData } from "next/image";
import { Search } from "lucide-react";
import BlogCard from "@/components/blog-card";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";

type Blog = {
    id: string;
    title: string;
    description: string;
    author: string;
    playlist: string;
    date: string;
    likes: number;
    comments: number;
    imageUrl?: string | StaticImageData;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);  
const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    fetch("/api/blogs/getBlogList")
      .then((r) => r.json())
      .then(setBlogs);
  }, []);

  return (
  <>
    <div className="min-h-screen flex mt-16 justify-center">
      <div className="w-full max-w-5xl items-center gap-2 sm:gap-3">
                <div className="relative">
                  <input
                    placeholder="What you wanna know??"
                    className="w-[22rem] sm:w-[32rem] md:w-[44rem] lg:w-[62rem] h-8 sm:h-9 md:h-10 border-none bg-[#121212] pl-8 pr-3 sm:pl-10 sm:pr-4 py-6 text-sm sm:text-base text-[#71A3F5] placeholder:text-[#71A3F5]/40 outline-none ring-2 ring-[#3B8BFB] font-red-hat-mono"
                    style={{
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "-0.07em",
                      borderRadius: "40px",
                    }}
                    suppressHydrationWarning
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71A3F5] pointer-events-none"
                    />
                </div>
                <div className="flex flex-col gap-6 mt-8">
            {blogs.map((blog) => (
                <BlogCard key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    description={blog.description}
                    playlist={blog.playlist}
                    date={blog.date}
                    likes={blog.likes}
                    comments={blog.comments}
                    author={blog.author}
                    image={blog.imageUrl}
                />
            ))}
                </div>
        </div>
        
    </div>
    <div className="flex items-center justify-center gap-3 py-6 sm:py-8 md:py-10">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Go to page ${n}`}
              className="relative flex items-center justify-center rounded-full bg-white p-0 w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px] shrink-0 cursor-pointer"
              style={{
                opacity: 1,
                background: "#FFFFFF",
              }}
              onClick={() => {
                setCurrentPage(n);
                console.log("Current Page:", currentPage);
              }}
            >
              <div
                className="absolute inset-0 rounded-full p-[3px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(137.77deg, #8EEBFF 10.19%, #28D781 37.77%, #F8FF1D 72.7%, #FF1717 97.98%)",
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
          <div className="flex justify-center ">
          </div>
        
      <footer className="flex gap-[24px] flex-wrap items-center justify-center">
        <Footer />
      </footer>
  </>
  );
}
