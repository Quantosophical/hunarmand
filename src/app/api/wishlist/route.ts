import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { artisan: { include: { user: true } } }
            }
          }
        }
      }
    });

    return NextResponse.json(wishlist?.items || []);
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    // Ensure wishlist exists for user
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: { items: true }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.user.id },
        include: { items: true }
      });
    }

    const existingItem = wishlist.items.find(item => item.productId === productId);

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
      return NextResponse.json({ message: "Removed from wishlist", status: "removed" });
    } else {
      // Add to wishlist
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId
        }
      });
      return NextResponse.json({ message: "Added to wishlist", status: "added" });
    }
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
