// lib/cart.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function addToCart(userId: string, productId: string) {
  const ref = doc(db, "users", userId, "cart", productId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      quantity: snap.data().quantity + 1,
    });
  } else {
    await setDoc(ref, {
      quantity: 1,
      addedAt: serverTimestamp(),
    });
  }
}

export async function updateCartQuantity(
  userId: string,
  productId: string,
  qty: number
) {
  const ref = doc(db, "users", userId, "cart", productId);

  if (qty <= 0) {
    await deleteDoc(ref);
    return;
  }

  await updateDoc(ref, { quantity: qty });
}

export async function removeFromCart(userId: string, productId: string) {
  const ref = doc(db, "users", userId, "cart", productId);
  await deleteDoc(ref);
}

export async function getCart(userId: string) {
  const colRef = collection(db, "users", userId, "cart");
  const snap = await getDocs(colRef);

  const cart: Record<string, number> = {};

  snap.forEach((doc) => {
    cart[doc.id] = doc.data().quantity;
  });

  return cart;
}
