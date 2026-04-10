import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { performSemanticTranslation } from "@/lib/translationMock";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { conversationId, text, artisanId } = await req.json();
    if (!text || (!conversationId && !artisanId)) {
       return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    let currentConversationId = conversationId;

    // Create conversation if it doesn't exist
    if (!currentConversationId && artisanId) {
      let existing = await prisma.conversation.findFirst({
        where: { buyerId: session.user.id, artisanId }
      });
      if (!existing) {
        existing = await prisma.conversation.create({
          data: { buyerId: session.user.id, artisanId }
        });
      }
      currentConversationId = existing.id;
    }

    const translatedText = performSemanticTranslation(text);

    const message = await prisma.message.create({
      data: {
        conversationId: currentConversationId,
        senderId: session.user.id,
        text,
        translatedText
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Translation Chat Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const artisanId = searchParams.get("artisanId");

    if (!artisanId) return NextResponse.json({ message: "Missing artisanId" }, { status: 400 });

    const conversation = await prisma.conversation.findFirst({
      where: { buyerId: session.user.id, artisanId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return NextResponse.json(conversation?.messages || []);
  } catch (error) {
    console.error("Chat GET Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
