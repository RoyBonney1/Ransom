import Card from "./Card";
import { getProducts } from "@/lib/getProducts";

export default async function HomeProducts() {
  const products = await getProducts(); // Firestore

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium w-full">All Products</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
        {products.map((product: any) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
