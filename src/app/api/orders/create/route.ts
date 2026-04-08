import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { address } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = cart.items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);

    const savedAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        phone: address.phone,
      }
    });

    // Create real Razorpay order
    const options = {
      amount: totalAmount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    let rpOrder;
    try {
      rpOrder = await razorpay.orders.create(options);
    } catch (e) {
      console.error("Razorpay error, returning mock order:", e);
      // Fallback for mock environments
      rpOrder = { id: "order_mock_" + Date.now(), amount: totalAmount * 100, currency: "INR" };
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: savedAddress.id,
        totalAmount,
        status: "PENDING", // Wait for verification to mark PROCESSING or PAID
        paymentReference: rpOrder.id,
        items: {
          create: cart.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ 
      message: "Order created", 
      orderId: order.id,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "dummy_key"
    }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
