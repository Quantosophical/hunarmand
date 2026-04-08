import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    
    // Hash creation for verification
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // We allow dummy_secret to pass for MVP local testing purposes
    if (generated_signature === razorpay_signature || process.env.RAZORPAY_KEY_SECRET === "dummy_secret") {
      
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentReference: razorpay_payment_id
        }
      });

      return NextResponse.json({ message: "Verification successful", order }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid Signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
