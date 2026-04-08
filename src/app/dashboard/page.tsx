import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ClientAddProductButton from "@/components/dashboard/ClientAddProductButton";

export default async function ArtisanDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ARTISAN") {
    redirect("/login");
  }

  const profile = await prisma.artisanProfile.findUnique({
    where: { userId: session.user.id },
    include: { products: true, payoutRequests: true }
  });

  if (!profile) {
    return <div>Error loading profile</div>;
  }

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
           <div className="bg-surface-dark border border-border-gold/10 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="font-sans text-xs tracking-widest text-text-muted uppercase mb-4">Patronage (Earnings)</p>
              <p className="font-heading text-5xl text-accent">₹0</p>
           </div>
           <div className="bg-surface-dark border border-border-gold/10 rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="font-sans text-xs tracking-widest text-text-muted uppercase mb-4">Pending Commissions</p>
              <p className="font-heading text-5xl text-cream">0</p>
           </div>
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
                     </tr>
                   )
                 }) : (
                   <tr>
                     <td colSpan={6} className="p-16 text-center">
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
