import { NextResponse } from "next/server";
import getListings from "@/app/actions/getListings";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = {
    category: searchParams.get("category") ?? undefined,
    query: searchParams.get("query") ?? undefined,
    brandSlug: searchParams.get("brandSlug") ?? undefined,
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  };
  try {
    const listings = await getListings(params);
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
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
  const {
    title,
    slugifyTitle,
    brandEmail,
    createdAt,
    content,
    brandId,
    userId,
  } = body;
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });
  const listing = await prisma.listing.create({
    data: {
      title,
      slugifyTitle,
      brandEmail,
      createdAt,
      content,
      brandId,
      userId: currentUser.id
    }
  });
  return NextResponse.json(listing);
}
