import { prisma } from "../lib/prisma"; // adjust path
import type { BlogQuery, BlogIdParam } from "../schemas/blog";

const authorSelect = { id: true, name: true }; // never expose password/email

export async function getBlogPosts({ locale, page, limit, search }: BlogQuery) {
  const where = {
    published: true,
    locale,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { excerpt: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      select: {
        id: true,
        slug: true,
        locale: true,
        title: true,
        excerpt: true,
        coverImage: true,
        published: true,
        publishedAt: true,
        author: { select: authorSelect },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getBlogPostById({ id }: BlogIdParam) {
  return prisma.blogPost.findFirst({
    where: { id, published: true },
    include: { author: { select: authorSelect } },
  });
}
