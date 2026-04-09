"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

// Minimal product type to avoid importing Prisma types in client component
type ProductProp = {
  id: string;
  title: string;
  description: string;
  craftCategory: string;
  price: number;
  stock: number;
  timeToMake: string | null;
  materials: string | null;
  shippingWeight: number;
  images: string;
}

export default function ClientEditProductButton({ product }: { product: ProductProp }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    craftCategory: product.craftCategory,
    price: product.price.toString(),
    stock: product.stock.toString(),
    timeToMake: product.timeToMake || "",
    materials: product.materials || "",
    shippingWeight: product.shippingWeight.toString(),
  });

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    try {
      setImages(JSON.parse(product.images || "[]"));
    } catch {
      setImages([]);
    }
  }, [product.images]);

  const handleUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      setImages(prev => [...prev, result.info.secure_url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one image of your craft.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          shippingWeight: parseFloat(formData.shippingWeight),
          images: JSON.stringify(images)
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update artifact");
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error updating artifact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-accent text-xs tracking-widest uppercase hover:underline"
      >
        Edit
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-2 w-full">
            <h2 className="text-2xl font-heading font-light italic text-cream mb-6 border-b border-border-gold/30 pb-4">Edit Masterpiece</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Title</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" />
                </div>
                <div>
                    <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Description</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Category</label>
                        <select required value={formData.craftCategory} onChange={e => setFormData({...formData, craftCategory: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none">
                            <option value="Pashmina">Pashmina</option>
                            <option value="Walnut Wood">Walnut Wood</option>
                            <option value="Papier Mâché">Papier-Mache</option>
                            <option value="Sozni Embroidery">Sozni Embroidery</option>
                            <option value="Carpet Weaving">Carpet Weaving</option>
                            <option value="Copperware">Copperware</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Price (₹)</label>
                        <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Stock</label>
                        <input required type="number" min="1" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" />
                    </div>
                    <div>
                        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Weight (grams)</label>
                        <input required type="number" min="0" value={formData.shippingWeight} onChange={e => setFormData({...formData, shippingWeight: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Time to Make</label>
                        <input placeholder="e.g. 3 weeks" value={formData.timeToMake} onChange={e => setFormData({...formData, timeToMake: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" />
                    </div>
                    <div>
                        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Materials</label>
                        <input placeholder="e.g. Silk, Wool" value={formData.materials} onChange={e => setFormData({...formData, materials: e.target.value})} className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1 mt-2">Authentic Images</label>
                    <CldUploadWidget uploadPreset="hunarmand_preset" onSuccess={handleUpload}>
                      {({ open }) => {
                        return (
                          <button type="button" onClick={() => open()} className="w-full border-2 border-dashed border-border-gold/30 hover:border-accent bg-surface-mid/10 text-text-muted py-6 rounded-lg flex flex-col items-center justify-center transition-colors">
                            <span className="text-xl mb-1 text-accent">+</span>
                            <span className="font-sans text-xs tracking-widest uppercase">Add More Media</span>
                          </button>
                        );
                      }}
                    </CldUploadWidget>

                    {images.length > 0 && (
                      <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                        {images.map((url, i) => (
                          <div key={i} className="relative group shrink-0">
                            <img src={url} alt={`Upload ${i}`} className="h-16 w-16 object-cover rounded-md border border-border-gold/30" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-gold text-primary font-accent tracking-widest text-sm uppercase py-4 mt-6 font-bold hover:brightness-110 transition-all flex justify-center items-center">
                    {loading ? <Spinner size="sm" className="text-primary"/> : "Save Changes"}
                </button>
            </form>
        </div>
      </Modal>
    </>
  );
}
