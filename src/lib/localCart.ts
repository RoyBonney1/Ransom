export function getCart() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function addToCart(item: any) {
  const cart = getCart();
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((item: any) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateQuantity(id: string, qty: number) {
  const cart = getCart().map((item: any) =>
    item.id === id ? { ...item, qty } : item
  );
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem("cart");
}
