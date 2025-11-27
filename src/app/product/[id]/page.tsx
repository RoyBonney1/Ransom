"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getSingleProduct } from "@/lib/getSingleProduct";
import { getProducts } from "@/lib/getProducts";
import { addToCart as addToCartFirestore } from "@/lib/cart";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const [product, setProduct] = useState<any | null>(null);
  const [featured, setFeatured] = useState<any[]>([]);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    async function load() {
      const data = await getSingleProduct(id as string);
      setProduct(data);

      if (data?.images?.length) {
        setMainImage(data.images[0]);
      }

      const all = await getProducts();
      setFeatured(all.slice(0, 5));
    }

    load();
  }, [id]);

  // Add to cart using Firestore
  const handleAddToCart = async () => {
    if (!product || !userId) {
      alert("Please sign in to add items to cart");
      return;
    }

    try {
      await addToCartFirestore(userId, product.id);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/cart");
  };

  if (!product) return <p className="p-10">Loading...</p>;

  return (
    <div className="px-6 md:px-16 lg:px-32 py-10 space-y-10">
      {/* PRODUCT TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT - IMAGES */}
        <div>
          <div className="rounded-lg overflow-hidden bg-gray-100 mb-4">
            <Image
              src={mainImage}
              alt="Product image"
              width={1000}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className="cursor-pointer rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={img}
                  alt="Thumbnail"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - PRODUCT INFO */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <p className="text-gray-600 mt-4">{product.description}</p>

          <p className="text-3xl font-semibold mt-6">
            ${product.offerPrice}
            <span className="ml-2 text-gray-500 line-through text-lg">
              ${product.price}
            </span>
          </p>

          <p className="mt-4 text-gray-700">
            Category:
            <span className="ml-2 font-medium">{product.category}</span>
          </p>

          <div className="flex gap-4 mt-10">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-black text-white hover:bg-gray-900"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div>
        <h2 className="text-2xl font-semibold text-center mt-16">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
          {featured.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/product/${item.id}`)}
              className="border p-3 rounded cursor-pointer hover:shadow"
            >
              <Image
                src={item.images[0]}
                alt=""
                width={300}
                height={300}
                className="w-full h-auto"
              />
              <p className="font-semibold mt-2">{item.name}</p>
              <p className="text-gray-500 text-sm">${item.offerPrice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
