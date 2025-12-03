import React from "react";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, UserButton, SignedIn } from "@clerk/nextjs";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function page() {
  return (
    <div className="m-4">
      <HeaderSlider />
      <HomeProducts />
    </div>
  );
}

export default page;
