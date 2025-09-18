
import React, { Suspense } from "react";
import ShopPage from "@/components/shop";
import { getProductsUser } from "@/lib/api";

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

