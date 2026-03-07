import prisma from "@/app/libs/prismadb";

export default async function getBrandBySlug(slug: string) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        category: true,
        _count: {
          select: { listing: true },
        },
      },
    });

    if (!brand) {
      return null;
    }

    // Fetch email frequency stats: oldest and newest listing dates
    const [oldestListing, newestListing] = await Promise.all([
      prisma.listing.findFirst({
        where: { brandId: brand.id },
        orderBy: { receivedAt: 'asc' },
        select: { receivedAt: true, createdAt: true },
      }),
      prisma.listing.findFirst({
        where: { brandId: brand.id },
        orderBy: { receivedAt: 'desc' },
        select: { receivedAt: true, createdAt: true },
      }),
    ]);

    const firstEmailDate = oldestListing
      ? (oldestListing.receivedAt ?? oldestListing.createdAt).toISOString()
      : null;
    const latestEmailDate = newestListing
      ? (newestListing.receivedAt ?? newestListing.createdAt).toISOString()
      : null;

    return {
      ...brand,
      firstEmailDate,
      latestEmailDate,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch brand.");
  }
}
