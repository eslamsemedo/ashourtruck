// app/admin/products/page.tsx
import AdminProduct from "@/components/AdminProduct";
import { cookies } from "next/headers";

export default async function Page() {
  // const cookieStore = cookies();
  // const token = (await cookieStore).get("admin_token")?.value;

  // // 👇 This logs only on the server terminal, not in browser devtools
  // console.log("Admin token:", token);
  return <AdminProduct initialLang="en" />;
}