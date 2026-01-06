"use client";

import { StaticImageData } from "next/image";
import { Search } from "lucide-react";
import BlogCard from "@/components/blog-card";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import Pagination from "@/components/pagination";
import { set } from "zod";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const blogsPerPage = 6;
  useEffect(() => {
    fetch(`/api/blogs/getBlogList?page=${currentPage}&limit=${blogsPerPage}&search=${searchTerm}`)
      .then((r) => r.json())
      .then((data) => {
        setBlogs(data.blogs);
        setTotalPages(data.meta.totalPages);
      });
  }, [currentPage, searchTerm]);

  return (
  <>
    <div className="min-h-screen flex mt-16 justify-center">
      <div className="w-full max-w-5xl items-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 md:px-8 lg:px-0 pb-12 flex flex-col">
                <div className="relative">
                  <input
                    placeholder="What you wanna know??"
                    className="w-[22rem] sm:w-[32rem] md:w-[44rem] lg:w-[62rem] h-8 sm:h-9 md:h-10 border-none bg-[#121212] pl-9 pr-3 sm:pl-10 sm:pr-4 py-6 text-sm sm:text-base text-[#71A3F5] placeholder:text-[#71A3F5]/40 outline-none ring-2 ring-[#3B8BFB] font-red-hat-mono"
                    style={{
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "-0.07em",
                      borderRadius: "40px",
                    }}
                    suppressHydrationWarning
                    onChange={(e) => { 
                      setSearchTerm(e.target.value); 
                      setCurrentPage(1); 
                    }}
                  />
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71A3F5] pointer-events-none"
                    />
                </div>
                <div className="flex flex-col gap-6 mt-8 min-w-full">
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
    
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={ (page) => {
      setCurrentPage(page);
      window.scrollTo({ 
        top: 0,
        behavior: "smooth"
      });
    }} />
        
      <footer className="flex gap-[24px] flex-wrap items-center justify-center">
        <Footer />
      </footer>
  </>
  );
}
