
import React, { Suspense } from "react";
import ShopPage from "@/components/shop";
import { getProductsUser } from "@/lib/api";

export const dynamic = 'force-dynamic';           // opt into dynamic rendering
// or:
export const fetchCache = 'force-no-store';       // disable caching for all fetch in this route

export default async function Page() {
  let data;

  try {
    data = await getProductsUser("https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/products");
  } catch (err) {
    throw new Error()
  }

  // console.log(data);

  return <ShopPage data={data.data} />
}

