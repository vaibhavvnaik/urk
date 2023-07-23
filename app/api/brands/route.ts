import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  try {
    const brands = await prisma.brand.findMany();
    res.status(200).json(brands);
  }
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function POST(
    request: Request, 
  ) {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await request.json();
    const { name, 
      description,
      siteURL,
      bannerImage,
      logo,
      email,
      category_id} = body;

    if (!name || !description) {
        return NextResponse.error();
    }
  
    const brand = await prisma.brand.create({
      data: {
        name,
        description,
        siteURL,
        bannerImage,
        logo,
        email,
        category_id
      }
    });
  
    return NextResponse.json(brand);
}