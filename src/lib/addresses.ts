import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

export async function saveAddress(userId: string, addressData: any) {
  const newRef = doc(collection(db, "users", userId, "addresses"));
  await setDoc(newRef, {
    id: newRef.id,
    ...addressData,
    createdAt: new Date(),
  });

  return newRef.id;
}

export async function getAddresses(userId: string) {
  const ref = collection(db, "users", userId, "addresses");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => doc.data());
}

export async function deleteAddress(userId: string, addressId: string) {
  const ref = doc(db, "users", userId, "addresses", addressId);
  await deleteDoc(ref);
}
