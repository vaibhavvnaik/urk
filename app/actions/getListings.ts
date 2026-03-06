import prisma from "@/app/libs/prismadb";
export interface IListingsParams {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export default async function getListings(
  params: IListingsParams
) {
  try {
    const {
      category,
      startDate,
      endDate
    } = params;

    const listings = await prisma.listing.findMany({
      include: {
        brand: {
          include: {
            category: true,
          },
        },
      },
      where: {
        slugifyTitle: { not: null },
        brand: {
          category: {
            name: category,
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch listings.");
  }
}
