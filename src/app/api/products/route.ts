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

    const artisan = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!artisan) {
      return NextResponse.json({ message: "Artisan profile not found" }, { status: 404 });
    }

    const data = await req.json();

    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        craftCategory: data.craftCategory,
        price: data.price,
        stock: data.stock,
        materials: data.materials || "",
        timeToMake: data.timeToMake || "",
        isGITagged: data.isGITagged || false,
        shippingWeight: data.shippingWeight || 0,
        internationalShipping: data.internationalShipping || false,
        images: data.images, // JSON array string
        artisanId: artisan.id,
      }
    });

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
