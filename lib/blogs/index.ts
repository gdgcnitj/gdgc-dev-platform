import "server-only";

import { db } from "@/lib/database";
import { blog, user } from "@/lib/database/schema";
import { desc, eq } from "drizzle-orm";

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

export async function getBlogList() {
  const blogs = await db
    .select()
    .from(blog)
    .orderBy(desc(blog.createdAt));
  
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

  return blogList;
}