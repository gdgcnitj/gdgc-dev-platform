export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getBlogList } from "@/lib/blogs/index";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);
  const search = searchParams.get("search") || undefined;

  const blogs = await getBlogList(page, limit, search);
  return NextResponse.json(blogs);
}