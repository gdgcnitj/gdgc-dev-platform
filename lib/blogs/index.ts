import "server-only";

import { db } from "@/lib/database";
import { blog, user } from "@/lib/database/schema";
import { desc, eq, ilike, or } from "drizzle-orm";

export async function getAuthorNamebyId(authorId: string) {
  const author = await db
    .select()
    .from(user)
    .where(eq(user.id, authorId))
    .limit(1);
  return author[0]["name"];
}

export async function getPlaylistNamebyId(playlistId: string) {
  const playlist = await db
    .select()
    .from(blog)
    .where(eq(blog.playlistId, playlistId))
    .limit(1);
  return playlist[0]["title"];
}

export async function getBlogList(page : number = 1, limit : number = 6, search? : string) {
  const blogs = await db
    .select()
    .from(blog)
    .where(search ? or(ilike(blog.title, `%${search}%`), ilike(blog.description, `%${search}%`)) : undefined)
    .orderBy(desc(blog.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
  
  let blogList = await Promise.all(blogs.map(async (b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    author: await getAuthorNamebyId(b.authorId),
    playlist: await getPlaylistNamebyId(b.playlistId),
    date: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(b.createdAt)),
    likes: b.likes,
    comments: b.comments,
    imageUrl: b.imageUrl,
  })));

  const totalBlogs = await db
    .$count(blog, search ? or(ilike(blog.title, `%${search}%`), ilike(blog.description, `%${search}%`)) : undefined);

  const totalPages = Math.ceil(totalBlogs / limit);

  return {
    blogs: blogList,
    meta: {
      totalPages: totalPages,
      currentPage: page,
      totalBlogs: totalBlogs,
    },
  };

}