import { prisma } from "../lib/prisma"; // adjust path
const authorSelect = { id: true, name: true }; // never expose password/email
export async function getBlogPosts({ locale, page, limit, search }) {
    const where = {
        published: true,
        locale,
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
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
                images: true
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
export async function getBlogPostById({ id }) {
    return prisma.blogPost.findFirst({
        where: { id, published: true },
        include: { author: { select: authorSelect } },
    });
}
