'use server';

import prisma from "@/app/libs/prismadb";

export interface IBrandsParams {
  category?: string;
}

export default async function getAllBrands(params?: IBrandsParams) {
  try {
    const where: any = {};

    if (params?.category) {
      where.category = {
        name: params.category,
      };
    }

    const brands = await prisma.brand.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { listing: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return brands;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch brands.");
  }
}
