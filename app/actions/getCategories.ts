import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getCategories() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const categories = await prisma.category.findMany();


    const safeCategories = categories.map((category) => ({
      ...category,
    }));

    return safeCategories;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch categories.");
  }
}
