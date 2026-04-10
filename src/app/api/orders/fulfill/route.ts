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

    const { orderItemId, trackingNumber } = await req.json();
    if (!orderItemId || !trackingNumber) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Verify artisan owns the product in the order item
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { product: true, order: true }
    });

    if (!orderItem) return NextResponse.json({ message: "Order item not found" }, { status: 404 });

    const profile = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile || orderItem.product.artisanId !== profile.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Update parent order status and tracking
    // Note: In a multi-artisan cart this will mark the entire order Shipped. MVP approach.
    await prisma.order.update({
      where: { id: orderItem.orderId },
      data: {
        status: "SHIPPED",
        trackingNumber: trackingNumber
      }
    });

    return NextResponse.json({ message: "Order marked as shipped" });
  } catch (error) {
    console.error("Fulfill Order POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
