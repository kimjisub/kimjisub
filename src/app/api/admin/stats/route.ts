import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

// GET /api/admin/stats - Dashboard stats
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalViews,
      totalReactions,
      totalComments,
      pendingTestimonials,
      newContacts,
      topPages,
      recentComments,
    ] = await Promise.all([
      prisma.pageView.count(),
      prisma.reaction.count(),
      prisma.comment.count(),
      prisma.testimonial.count({ where: { status: "PENDING" } }),
      prisma.contact.count({ where: { status: "NEW" } }),
      prisma.$queryRaw<{ slug: string; count: bigint }[]>`
        SELECT slug, COUNT(*) as count 
        FROM page_views 
        GROUP BY slug 
        ORDER BY count DESC 
        LIMIT 10
      `,
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          postSlug: true,
          authorName: true,
          content: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalViews,
      totalReactions,
      totalComments,
      pendingTestimonials,
      newContacts,
      topPages: topPages.map((p) => ({
        slug: p.slug,
        count: Number(p.count),
      })),
      recentComments,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
