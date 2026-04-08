import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const pendingArtisans = await prisma.artisanProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: { user: true }
  });

  return (
    <div className="bg-deep-black min-h-screen text-cream py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12">
          <h1 className="font-heading text-4xl lg:text-5xl font-light mb-2">Guild Administration</h1>
          <p className="font-sans text-sm tracking-wide text-text-muted">Oversee artisan verifications and marketplace integrity.</p>
        </div>
        
        <div className="bg-surface-dark border border-border-gold shadow-[0_10px_30px_rgba(201,168,76,0.05)] rounded-[1px] p-8 mb-12">
           <h2 className="text-xl font-heading font-light mb-8 italic text-cream-dark">Pending Artisan Verifications</h2>
           
           {pendingArtisans.length > 0 ? (
             <ul className="space-y-6">
               {pendingArtisans.map((artisan) => (
                 <li key={artisan.id} className="border border-border-gold/30 bg-surface-mid p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-border-gold transition-colors">
                   <div>
                     <p className="font-heading text-2xl text-cream mb-1">{artisan.user.name}</p>
                     <p className="font-sans text-sm text-text-muted mb-3 flex items-center gap-2">
                       <span className="text-accent">{artisan.craftType}</span>
                       <span className="w-1 h-1 bg-border-gold/50 rounded-full inline-block"/>
                       {artisan.village}, {artisan.district}
                     </p>
                     {artisan.craftLineage && (
                       <p className="font-sans text-xs bg-deep-black border border-border-gold/20 p-3 italic text-cream-dark">
                         " {artisan.craftLineage} "
                       </p>
                     )}
                   </div>
                   <div className="flex gap-4 w-full md:w-auto">
                     <form action={async () => {
                       "use server";
                       await prisma.artisanProfile.update({ where: { id: artisan.id }, data: { verificationStatus: "VERIFIED" }});
                       revalidatePath("/admin");
                     }} className="flex-1 md:flex-none">
                        <button type="submit" className="w-full bg-gradient-gold text-primary font-accent tracking-widest text-[0.65rem] uppercase px-6 py-3 font-bold hover:brightness-110 transition-all border border-transparent">
                          Approve
                        </button>
                     </form>
                     <form action={async () => {
                       "use server";
                       await prisma.artisanProfile.update({ where: { id: artisan.id }, data: { verificationStatus: "REJECTED" }});
                       revalidatePath("/admin");
                     }} className="flex-1 md:flex-none">
                        <button type="submit" className="w-full bg-transparent border border-error/50 text-error font-accent tracking-widest text-[0.65rem] uppercase px-6 py-3 font-bold hover:bg-error/10 transition-all">
                          Reject
                        </button>
                     </form>
                   </div>
                 </li>
               ))}
             </ul>
           ) : (
             <div className="text-center py-20 border border-dashed border-border-gold/30 bg-surface-mid rounded-[1px]">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1" className="mx-auto mb-4 opacity-50"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
               <p className="font-heading italic text-xl text-cream-dark mb-2">No pending verifications.</p>
               <p className="font-sans text-xs tracking-wide text-text-muted">The guild registry is up to date.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
