"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white shadow hover:shadow-lg p-4 rounded-lg transition">
        <Image
          src={product.images?.[0]}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-md object-cover w-full h-48"
        />

        <h3 className="font-semibold mt-3">{product.name}</h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-black font-semibold">
            ${product.offerPrice}
          </span>

          {product.offerPrice > 0 && (
            <span className="text-red-500 line-through text-sm">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
