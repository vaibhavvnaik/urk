'use server';

import prisma from "@/app/libs/prismadb";

export default async function getBrandBySlug(slug: string) {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        slug: slug,
      },
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

    return brand;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch brand.");
  }
}
