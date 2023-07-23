import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getBrands() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const brands = await prisma.brand.findMany();

    const safeBrands = brands.map((brand) => ({
      ...brand,
    }));

    return safeBrands;
  } catch (error: any) {
    throw new Error(error);
  }
}