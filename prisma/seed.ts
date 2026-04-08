// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing items if we want to reset completely safely
  // (In production this is dangerous, but suitable for local reset)
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.artisanProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create a Master Artisan: Weaver
  const artisan1User = await prisma.user.create({
    data: {
      name: "Tariq Ahmad Dar",
      email: "tariq.weaver@hunarmand.local",
      passwordHash,
      role: "ARTISAN",
      artisanProfile: {
        create: {
          craftType: "Pashmina",
          village: "Eidgah",
          district: "Srinagar",
          yearsExperience: 25,
          craftLineage: "6th Generation",
          bio: "My family has woven Pashmina since the era of Sultan Zain-ul-Abidin. Every thread is a poem passed down from my grandfather.",
          verificationStatus: "VERIFIED",
          isActive: true
        }
      }
    },
    include: { artisanProfile: true }
  });

  // 2. Create an Artisan: Wood Carver
  const artisan2User = await prisma.user.create({
    data: {
      name: "Ghulam Nabi",
      email: "gnabi.wood@hunarmand.local",
      passwordHash,
      role: "ARTISAN",
      artisanProfile: {
        create: {
          craftType: "Walnut Wood",
          village: "Khanyar",
          district: "Srinagar",
          yearsExperience: 40,
          craftLineage: "3rd Generation",
          bio: "The wood speaks to me. I simply remove what isn't the story. I source only naturally fallen walnut wood from the valley.",
          verificationStatus: "VERIFIED",
          isActive: true
        }
      }
    },
    include: { artisanProfile: true }
  });

  // 3. Create a User: Buyer
  const buyerUser = await prisma.user.create({
    data: {
      name: "Rohan Sharma",
      email: "rohan@buyer.local",
      passwordHash,
      role: "BUYER"
    }
  });

  // 4. Products for Artisan 1
  if (artisan1User.artisanProfile) {
    await prisma.product.create({
      data: {
        artisanId: artisan1User.artisanProfile.id,
        title: "Hand-spun Kani Pashmina Shawl",
        description: "A spectacular full-size Kani shawl featuring intricate floral motifs. Woven entirely by hand on a traditional loom over 8 months.",
        craftCategory: "Pashmina",
        price: 85000,
        stock: 1,
        materials: "100% Pure Ladakhi Pashmina",
        timeToMake: "8 months",
        isGITagged: true,
        shippingWeight: 350,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1601924638848-bc694eb09dd2?auto=format&fit=crop&w=800&q=80"
        ])
      }
    });

    await prisma.product.create({
      data: {
        artisanId: artisan1User.artisanProfile.id,
        title: "Solid Charcoal Pashmina Stole",
        description: "A lightweight, extremely warm diamond-weave stole. Perfect for evening wear.",
        craftCategory: "Pashmina",
        price: 18000,
        stock: 5,
        materials: "Pure Pashmina",
        timeToMake: "2 weeks",
        isGITagged: true,
        shippingWeight: 180,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=800&q=80"
        ])
      }
    });
  }

  // 5. Products for Artisan 2
  if (artisan2User.artisanProfile) {
    await prisma.product.create({
      data: {
        artisanId: artisan2User.artisanProfile.id,
        title: "Chinar Motif Carved Box",
        description: "An incredibly detailed jewelry box crafted from a single block of Kashmiri walnut wood lined with velvet.",
        craftCategory: "Walnut Wood",
        price: 12500,
        stock: 3,
        materials: "Aged Walnut Wood (Juglans regia)",
        timeToMake: "3 weeks",
        isGITagged: true,
        shippingWeight: 900,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1533090368676-1fd25485db88?auto=format&fit=crop&w=800&q=80"
        ])
      }
    });

    await prisma.product.create({
      data: {
        artisanId: artisan2User.artisanProfile.id,
        title: "Intricate Antique Folding Table",
        description: "A heritage folding table with deep relief floral carving. The wood has been seasoned for exactly 3 years before carving.",
        craftCategory: "Walnut Wood",
        price: 45000,
        stock: 1,
        materials: "Aged Walnut Wood",
        timeToMake: "2 months",
        isGITagged: true,
        shippingWeight: 4500,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1545041076-2ebd4ec9f0d1?auto=format&fit=crop&w=800&q=80"
        ])
      }
    });
  }

  console.log("Seeding complete! Simulated data injected.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
