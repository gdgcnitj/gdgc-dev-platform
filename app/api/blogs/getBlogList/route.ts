export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getBlogList } from "@/lib/blogs/index";

export async function GET() {
  const blogs = await getBlogList();
  return NextResponse.json(blogs);
}