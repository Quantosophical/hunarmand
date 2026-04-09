import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct || existingProduct.artisanId !== artisan.id) {
       return NextResponse.json({ message: "Product not found or access denied" }, { status: 404 });
    }

    const data = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        craftCategory: data.craftCategory,
        price: data.price,
        stock: data.stock,
        materials: data.materials || "",
        timeToMake: data.timeToMake || "",
        shippingWeight: data.shippingWeight || 0,
        images: data.images, // JSON array string
      }
    });

    return NextResponse.json({ message: "Product updated successfully", product }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
