import ShopPage from "@/components/shop";
import { getProductsUser } from "@/lib/api";
import { ProductRecord } from "@/types/products";

// Function to fetch products data
async function getProducts() {
  try {
    const response = await getProductsUser("https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array if error occurs
  }
}

// Server Component that fetches the data server-side
export default async function Page() {
  const data = await getProducts(); // Fetch products data on the server

  return <ShopPage data={data} />;
}