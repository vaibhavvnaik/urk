import prisma from "@/app/libs/prismadb";

 interface IParams {
  brandId?: string;
}
 export default async function getBrandById(params: IParams) {
  try {
    const { brandId } = params;
     const brand = await prisma.brand.findUnique({
      where: {
        id: brandId,
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
