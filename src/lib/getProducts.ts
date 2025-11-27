import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getProducts() {
  const snapshot = await getDocs(collection(db, "products"));

  const products = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toMillis() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,
    };
  });

  return products;
}
