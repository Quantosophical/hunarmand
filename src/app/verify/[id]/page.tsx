import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CertClient from "@/components/verify/CertClient";
import crypto from "crypto";

export default async function VerifyCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              artisan: {
                include: { user: true }
              }
            }
          }
        }
      }
    }
  });

  if (!order || order.items.length === 0) {
    notFound();
  }

  // MVP: We emphasize the first item on the cert
  const primaryItem = order.items[0]; 
  const product = primaryItem.product;
  const artisan = product.artisan;

  const hashPayload = `${order.id}-${artisan.id}-${order.totalAmount}-${order.createdAt.toISOString()}`;
  const provenanceHash = crypto.createHash("sha256").update(hashPayload).digest("hex");

  return <CertClient order={order} product={product} artisan={artisan} provenanceHash={provenanceHash} />;
}
