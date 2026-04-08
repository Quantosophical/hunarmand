import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, artisanProfile } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        ...(role === 'ARTISAN' && artisanProfile ? {
          artisanProfile: {
            create: {
              craftType: artisanProfile.craftType,
              village: artisanProfile.village,
              district: artisanProfile.district || "",
              yearsExperience: parseInt(artisanProfile.yearsExperience || "0"),
              craftLineage: artisanProfile.craftLineage || "",
              bio: artisanProfile.bio || "",
              verificationStatus: "PENDING",
            }
          }
        } : {})
      }
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: user.id, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
