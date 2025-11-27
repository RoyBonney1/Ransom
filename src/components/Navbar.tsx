"use client";

import Image from "next/image";
import Link from "next/link";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Home } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isOnCartPage = pathname === "/cart";

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2 cursor-pointer">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="BestDeals Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-14 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="text-gray-700 hover:text-black transition">
              Login
            </button>
          </SignInButton>

          <SignUpButton>
            <button className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          {isAdmin && (
            <Link
              href="/product/add"
              className="px-4 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              Admin Panel
            </Link>
          )}

          {!isAdmin && (
            <button
              onClick={() => router.push(isOnCartPage ? "/" : "/cart")}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title={isOnCartPage ? "Go to Home" : "Go to Cart"}
            >
              {isOnCartPage ? (
                <Home className="w-6 h-6 text-gray-700" />
              ) : (
                <ShoppingCart className="w-6 h-6 text-gray-700" />
              )}
            </button>
          )}

          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Cart"
                labelIcon={
                  <Image
                    src="/cart_icon.svg"
                    width={20}
                    height={20}
                    alt="Cart"
                  />
                }
                onClick={() => router.push("/cart")}
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
      </div>
    </nav>
  );
}
