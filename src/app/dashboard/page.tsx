import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ClientAddProductButton from "@/components/dashboard/ClientAddProductButton";
import ClientRequestPayoutButton from "@/components/dashboard/ClientRequestPayoutButton";
import ClientEditProductButton from "@/components/dashboard/ClientEditProductButton";
import ClientFulfillOrderButton from "@/components/dashboard/ClientFulfillOrderButton";

export default async function ArtisanDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ARTISAN") {
    redirect("/login");
  }

  // Prevent Prisma crash if legacy SQLite CUID is in session cookie
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(session.user.id);
  if (!isValidObjectId) {
    redirect("/api/auth/signout"); // Force them to clear old cookie
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { userId: session.user.id },
    include: { products: true, payoutRequests: true }
  });

  if (!profile) {
    return <div>Error loading profile</div>;
  }

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

  const pendingCommissionsCount = orderItems
    .filter(item => ["PENDING", "PROCESSING"].includes(item.order.status)).length;

  return (
    <div className="bg-deep-black min-h-screen text-cream py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl mb-2 text-cream">Guild Dashboard</h1>
            <p className="font-sans text-sm tracking-wide text-text-muted">Master {session.user.name}, welcome to your atelier.</p>
          </div>
        </div>
        
        {profile.verificationStatus === "PENDING" && (
           <div className="bg-surface-dark border border-accent/20 rounded-xl p-6 mb-12 shadow-lg relative overflow-hidden">
             <div className="relative z-10 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full border border-accent flex justify-center items-center shrink-0">
                  <span className="font-sans italic text-accent font-bold">i</span>
                </div>
                <div>
                  <h3 className="font-sans text-xs tracking-widest text-accent uppercase mb-2">Verification Pending</h3>
                  <p className="font-sans text-sm text-text-muted leading-relaxed max-w-3xl">The guild administration is currently reviewing your heritage records. Your masterpieces will enter the public gallery upon authentication.</p>
                </div>
             </div>
           </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <div className="bg-surface-dark border border-border-gold/10 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="font-sans text-xs tracking-widest text-text-muted uppercase mb-4">Total Artifacts</p>
              <p className="font-heading text-5xl text-cream">{profile.products.length}</p>
           </div>
           <div className="bg-surface-dark border border-border-gold/10 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div>
                <p className="font-sans text-xs tracking-widest text-text-muted uppercase mb-4">Available Balance</p>
                <p className="font-heading text-5xl text-accent">₹{availableBalance.toLocaleString('en-IN')}</p>
              </div>
              <div className="mt-6">
                <ClientRequestPayoutButton availableBalance={availableBalance} hasPending={pendingRequested > 0} />
              </div>
           </div>
           <div className="bg-surface-dark border border-border-gold/10 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="font-sans text-xs tracking-widest text-text-muted uppercase mb-4">Pending Commissions</p>
              <p className="font-heading text-5xl text-cream">{pendingCommissionsCount}</p>
           </div>
        </div>

        {profile.payoutRequests.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-heading text-cream mb-6">Payout History</h2>
            <div className="bg-surface-dark border border-border-gold/10 rounded-xl overflow-x-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
               <table className="w-full text-left font-sans whitespace-nowrap min-w-[700px]">
                  <thead className="bg-surface-mid/30 border-b border-border-gold/10">
                     <tr>
                        <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Date</th>
                        <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Amount</th>
                        <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Status</th>
                        <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Reference</th>
                     </tr>
                  </thead>
                  <tbody>
                     {profile.payoutRequests.map(req => (
                       <tr key={req.id} className="border-b border-border-gold/5 hover:bg-surface-mid/20 transition-colors">
                         <td className="p-6 text-sm text-text-muted">{req.createdAt.toLocaleDateString()}</td>
                         <td className="p-6 font-heading text-lg text-cream">₹{req.amount.toLocaleString('en-IN')}</td>
                         <td className="p-6">
                           <span className={`text-xs tracking-widest uppercase border rounded-md px-3 py-1 flex items-center gap-2 w-max ${req.status === 'PAID' ? 'text-accent border-accent/30' : 'text-text-muted border-border-gold/10'}`}>
                             {req.status === 'PAID' && <span className="w-1.5 h-1.5 bg-accent rounded-full inline-block"/>}
                             {req.status}
                           </span>
                         </td>
                         <td className="p-6 text-sm text-text-muted">{req.transactionRef || '-'}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

         <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <h2 className="text-xl font-heading text-cream">Pending Fulfillments</h2>
         </div>

         <div className="bg-surface-dark border border-border-gold/10 rounded-xl overflow-x-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-16">
            <table className="w-full text-left font-sans whitespace-nowrap min-w-[700px]">
               <thead className="bg-surface-mid/30 border-b border-border-gold/10">
                  <tr>
                     <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Order Date</th>
                     <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Artifact</th>
                     <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Qty</th>
                     <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Earned</th>
                     <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium text-right">Status</th>
                  </tr>
               </thead>
               <tbody>
                  {orderItems.filter(item => ["PENDING", "PROCESSING"].includes(item.order.status)).length > 0 ? (
                    orderItems.filter(item => ["PENDING", "PROCESSING"].includes(item.order.status)).map(item => (
                      <tr key={item.id} className="border-b border-border-gold/5 hover:bg-surface-mid/20 transition-colors">
                        <td className="p-6 text-sm text-text-muted">{item.order.createdAt.toLocaleDateString()}</td>
                        <td className="p-6 font-heading text-lg text-cream">{profile.products.find(p => p.id === item.productId)?.title}</td>
                        <td className="p-6 text-sm text-text-muted">{item.quantity}</td>
                        <td className="p-6 font-heading text-lg text-accent">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        <td className="p-6 text-right">
                          <ClientFulfillOrderButton orderItemId={item.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center">
                        <p className="font-heading text-lg text-cream mb-1">No pending orders.</p>
                        <p className="font-sans text-xs text-text-muted tracking-wide">All your sales have been fulfilled.</p>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

        <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <h2 className="text-xl font-heading text-cream">Your Masterpieces</h2>
           <ClientAddProductButton />
        </div>

        <div className="bg-surface-dark border border-border-gold/10 rounded-xl overflow-x-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
           <table className="w-full text-left font-sans whitespace-nowrap min-w-[700px]">
              <thead className="bg-surface-mid/30 border-b border-border-gold/10">
                 <tr>
                    <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Artifact</th>
                    <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Title</th>
                    <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Category</th>
                    <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Value</th>
                    <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">In Atelier</th>
                    <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium">Status</th>
                    <th className="p-6 text-xs tracking-widest uppercase text-text-muted font-medium text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {profile.products.length > 0 ? profile.products.map(p => {
                   const images = JSON.parse(p.images || "[]");
                   const mainImage = Array.isArray(images) && images.length > 0 ? images[0] : "";
                   return (
                     <tr key={p.id} className="border-b border-border-gold/5 hover:bg-surface-mid/20 transition-colors">
                       <td className="p-4 pl-6">
                         <div className="w-14 h-14 bg-surface-mid rounded-md overflow-hidden relative border border-border-gold/10">
                           {mainImage ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={mainImage} className="object-cover w-full h-full grayscale-[20%] hover:grayscale-0 transition-all" alt="Product" />
                           ) : (
                             <div className="w-full h-full bg-deep-black" />
                           )}
                         </div>
                       </td>
                       <td className="p-6 font-heading text-lg text-cream">{p.title}</td>
                       <td className="p-6 text-sm text-text-muted">{p.craftCategory}</td>
                       <td className="p-6 font-heading text-lg text-cream">₹{p.price.toLocaleString('en-IN')}</td>
                       <td className="p-6 text-sm text-text-muted">{p.stock}</td>
                       <td className="p-6">
                         {p.isActive ? 
                           <span className="text-accent text-xs tracking-widest uppercase border border-accent/30 rounded-md px-3 py-1 flex items-center gap-2 w-max"><span className="w-1.5 h-1.5 bg-accent rounded-full inline-block"/> Exhibited</span> : 
                           <span className="text-text-muted text-xs tracking-widest uppercase border border-border-gold/10 rounded-md px-3 py-1 w-max">In Progress</span>
                         }
                       </td>
                       <td className="p-6 text-right">
                         <ClientEditProductButton product={p} />
                       </td>
                     </tr>
                   )
                 }) : (
                   <tr>
                     <td colSpan={7} className="p-16 text-center">
                       <p className="font-heading text-xl text-cream mb-2">The atelier is empty.</p>
                       <p className="font-sans text-xs text-text-muted tracking-wide">It is time to create your first masterpiece.</p>
                     </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  )
}
