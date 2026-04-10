import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import DownloadInvoiceButton from "@/components/pdf/DownloadInvoiceButton";

export default async function BuyerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Prevent Prisma crash if legacy SQLite CUID is in session cookie
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id);
  if (!isValidObjectId) {
    redirect("/api/auth/signout");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { orders: { include: { items: { include: { product: true } } } } }
  });

  if (!user) return null;

  return (
    <div className="bg-deep-black min-h-screen text-cream py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-14">
          <h1 className="font-heading text-4xl mb-2 text-cream">My Atelier</h1>
          <p className="font-sans text-sm tracking-wide text-text-muted">Welcome back, patron {user.name}.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
             <div className="bg-surface-dark border border-border-gold/10 rounded-xl p-8 sticky top-32 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
               <ul className="space-y-4 font-sans text-sm tracking-wider">
                  <li className="font-sans text-accent tracking-widest text-xs uppercase flex items-center gap-2 pb-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    My Collection
                  </li>
                  <li className="text-text-muted hover:text-cream cursor-pointer transition-colors pt-2 border-t border-border-gold/10">Saved Addresses</li>
                  <li className="text-text-muted hover:text-cream cursor-pointer transition-colors pt-2 border-t border-border-gold/10">Curated Wishlist</li>
                  <li className="text-text-muted hover:text-cream cursor-pointer transition-colors pt-2 border-t border-border-gold/10">Account Settings</li>
               </ul>
             </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-surface-dark border border-border-gold/10 rounded-xl p-8 md:p-12 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
               <h2 className="text-xl font-heading mb-8 text-cream border-b border-border-gold/10 pb-4">Acquired Masterpieces</h2>
               
               {user.orders && user.orders.length > 0 ? (
                 <div className="space-y-6">
                   {user.orders.map((order) => (
                     <div key={order.id} className="border border-border-gold/10 bg-surface-mid/30 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-border-gold/30 transition-colors">
                       <div>
                         <p className="font-sans text-[0.65rem] tracking-widest text-accent uppercase mb-1">Order #{order.id.slice(-8)}</p>
                         <p className="font-sans text-sm text-text-muted mb-3">{new Date(order.createdAt).toLocaleDateString()}</p>
                         <div className="flex -space-x-2">
                            {order.items.map((item, i) => (
                              <div key={item.id} className={`w-8 h-8 rounded-full border border-deep-black bg-surface-dark shrink-0 flex items-center justify-center font-sans text-[0.6rem] text-accent z-[${10-i}]`}>
                                {i===0 ? "1" : "+"}
                              </div>
                            ))}
                         </div>
                       </div>
                       <div className="text-left md:text-right w-full md:w-auto space-y-3">
                         <p className="font-heading text-2xl text-cream mb-2">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                         <p className="font-sans text-xs text-text-muted mb-4">Status: {order.status}</p>
                         {order.status === "SHIPPED" && order.trackingNumber && (
                           <p className="font-sans text-[0.65rem] tracking-widest text-accent uppercase mb-4">Tracking: {order.trackingNumber}</p>
                         )}
                         <Link href={`/verify/${order.id}`} className="block text-center border rounded-md border-border-gold/30 text-accent px-6 py-2.5 font-sans tracking-widest text-xs uppercase hover:bg-gradient-gold hover:text-primary transition-all">
                           View Authenticity
                         </Link>
                         <div className="flex justify-center md:justify-end">
                           <DownloadInvoiceButton order={order} profile={user} />
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-20 border border-dashed border-border-gold/20 bg-surface-mid/20 rounded-xl">
                   <p className="font-heading text-2xl text-cream mb-2">No masterpieces acquired yet.</p>
                   <p className="font-sans text-xs tracking-wide text-text-muted mb-8">Your collection awaits.</p>
                   <Link href="/browse" className="border-b border-accent text-accent font-sans text-[0.65rem] tracking-widest uppercase hover:text-cream transition-colors pb-1">
                     Explore the Gallery
                   </Link>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
