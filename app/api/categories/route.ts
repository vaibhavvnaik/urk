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
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  }
  catch (error) {
    return NextResponse.error();
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
    const { name, description,} = body;

    if (!name || !description) {
        return NextResponse.error();
    }
  
    const category = await prisma.category.create({
      data: {
        name,
        description,
      }
    });
  
    return NextResponse.json(category);
}