import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ARTISAN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const artisanProfile = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!artisanProfile) {
      return NextResponse.json({ message: "Artisan profile not found" }, { status: 404 });
    }

    const {
      title,
      description,
      craftCategory,
      price,
      stock,
      shippingWeight,
      timeToMake,
      materials,
      images,
    } = await req.json();

    // Basic validation
    if (!title || !description || !craftCategory || price === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        artisanId: artisanProfile.id,
        title,
        description,
        craftCategory,
        price,
        stock,
        shippingWeight,
        timeToMake,
        materials,
        images, // JSON string of base64 images
        isActive: true, // Defaulting to true for MVP.
      }
    });

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });
    
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
