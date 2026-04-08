import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: { include: { artisan: { include: { user: true } } } } } } }
  });

  if (!cart && session.user.id) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id },
      include: { items: { include: { product: { include: { artisan: { include: { user: true } } } } } } }
    });
  }

  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { productId, quantity = 1 } = await req.json();

  let cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session.user.id } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity }
    });
  }

  return NextResponse.json({ message: "Added to cart" }, { status: 200 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { itemId } = await req.json();
  if (!itemId) return NextResponse.json({ message: "Item ID required" }, { status: 400 });

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

  await prisma.cartItem.deleteMany({
    where: { id: itemId, cartId: cart.id }
  });

  return NextResponse.json({ message: "Removed from cart" }, { status: 200 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { itemId, quantity } = await req.json();
  if (!itemId || quantity === undefined) return NextResponse.json({ message: "Item ID and quantity required" }, { status: 400 });

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id }
    });
  } else {
    await prisma.cartItem.updateMany({
      where: { id: itemId, cartId: cart.id },
      data: { quantity }
    });
  }

  return NextResponse.json({ message: "Cart updated" }, { status: 200 });
}
