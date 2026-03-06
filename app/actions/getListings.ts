'use server';
import prisma from "@/app/libs/prismadb";

const PAGE_SIZE = 24;

export interface IListingsParams {
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
}

export default async function getListings(
  params: IListingsParams
) {
  try {
    const {
      category,
      startDate,
      endDate,
      page = 1,
    } = params;

    const skip = (page - 1) * PAGE_SIZE;

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
        orderBy: [
          { receivedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: PAGE_SIZE,
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      receivedAt: listing.receivedAt?.toISOString() ?? null,
    }));

    return safeListings;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}
