import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ARTISAN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.artisanProfile.findUnique({
      where: { userId: session.user.id },
      include: { payoutRequests: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Double check balance server-side to prevent tampering
    const orderItems = await prisma.orderItem.findMany({
      where: { product: { artisanId: profile.id } },
      include: { order: true }
    });

    const totalEarnings = orderItems
      .filter(item => item.order.status !== "CANCELLED")
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const totalWithdrawn = profile.payoutRequests
      .filter(req => req.status === "PAID")
      .reduce((sum, req) => sum + req.amount, 0);

    const pendingRequested = profile.payoutRequests
      .filter(req => req.status === "PENDING" || req.status === "APPROVED")
      .reduce((sum, req) => sum + req.amount, 0);

    const availableBalance = totalEarnings - totalWithdrawn - pendingRequested;

    if (availableBalance <= 0) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const request = await prisma.payoutRequest.create({
      data: {
        artisanId: profile.id,
        amount: availableBalance,
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, payoutRequest: request }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to request payout" }, { status: 500 });
  }
}
