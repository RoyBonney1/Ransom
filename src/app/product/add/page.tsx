"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddProduct() {
  // Clerk
  const { user, isLoaded } = useUser();

  // ---------- HOOKS (MUST COME FIRST) ----------
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  // ----------------------------------------------

  if (!isLoaded) return <div className="text-center py-20">Loading...</div>;

  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin)
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        You are not authorized.
      </div>
    );

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile) return;

    // Limit to 4 images max
    if (files.length >= 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    setFiles((prev) => [...prev, newFile]);
    setPreviews((prev) => [...prev, URL.createObjectURL(newFile)]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return alert("Upload at least one image");

    // Upload all images to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: form }
      );
      return (await res.json()).secure_url;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Save product data
    await addDoc(collection(db, "products"), {
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      images: uploadedImages, // MULTIPLE IMAGES
      createdBy: user?.id,
      createdAt: serverTimestamp(),
    });

    alert("Product added!");

    // Reset form
    setFiles([]);
    setPreviews([]);
    setName("");
    setDescription("");
    setCategory("Clothing");
    setPrice("");
    setOfferPrice("");
  };

  return (
    <div className="w-full flex justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-lg w-full bg-white p-6 rounded-lg shadow"
      >
        {/* IMAGES */}
        <div>
          <p className="font-medium mb-2">Product Images (max 4)</p>

          <div className="flex gap-3 flex-wrap">
            {previews.map((src, index) => (
              <div key={index} className="relative">
                <Image
                  src={src}
                  alt="preview"
                  width={120}
                  height={120}
                  className="object-cover border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                >
                  X
                </button>
              </div>
            ))}

            {files.length < 4 && (
              <label className="cursor-pointer w-32 h-32 border rounded-md flex items-center justify-center">
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                <span className="text-gray-500">+ Add</span>
              </label>
            )}
          </div>
        </div>

        {/* NAME */}
        <div>
          <label className="font-medium">Product Name</label>
          <input
            className="border rounded px-3 py-2 w-full"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-medium">Description</label>
          <textarea
            className="border rounded px-3 py-2 w-full resize-none"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        {/* CATEGORY + PRICE */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col w-32">
            <label className="font-medium">Category</label>
            <select
              className="border rounded px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Clothing</option>
              <option>Shoes</option>
              <option>Watch</option>
              <option>Smartphone</option>
              <option>Laptop</option>
              <option>Accessories</option>
              <option>Computer</option>
              <option>Console</option>
              <option>Camera</option>
            </select>
          </div>

          <div className="flex flex-col w-32">
            <label className="font-medium">Price</label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              required
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-32">
            <label className="font-medium">Offer Price</label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              placeholder="0"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-full font-semibold"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
