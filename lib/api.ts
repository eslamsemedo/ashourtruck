"use server"
import { ApiPayload } from "@/types/products";
import { cookies } from "next/headers";


export async function getProductsUser(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Add cache-busting parameter when force refreshing
    const finalUrl = url;

    const res = await fetch(finalUrl, {
      cache: "no-store",
      signal: controller.signal,
      redirect: "follow",
      next: { revalidate: 60 }
    }); // Disable cache when force refreshing


    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('API Response time:', 'Data received:', data);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout after 10 seconds');
      throw new Error('Request timeout. Please try again.');
    }
    console.error("API Error:", error);
    throw error;
  }
}

export async function getAdminProduct() {
  // const ctrl = new AbortController();
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;


  const BACKEND_URL = process.env.BACKEND_URL; // or NEXT_PUBLIC_BACKEND_URL if used in the browser
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }

  try {
    const res = await fetch(`${BACKEND_URL}/admin/products`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      // signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: ApiPayload = await res.json()

    return data

  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
}



export async function editOrAddAdminProduct(formdata: FormData, id: number | false) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  const BACKEND_URL = process.env.BACKEND_URL
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }

  const url = id
    ? `${BACKEND_URL}/admin/products/${id}`
    : `${BACKEND_URL}/admin/products`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type for FormData; browser sets boundary
        Accept: "application/json",
      },
      body: formdata,
    });

    if (!res.ok) {
      const txt = await res.json();
      throw new Error(` ${txt.message}`);
    }
    const resData = await res.json()
    return resData

  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
}

export async function deleteAdminProduct(id: number) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  const BACKEND_URL = process.env.BACKEND_URL
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }
  console.log(`${BACKEND_URL}/admin/products/${id}`)
  try {
    const res = await fetch(`${BACKEND_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // try to surface backend error message
      // const j = await res.json();
      const txt = await res.json();
      throw new Error(` ${txt.message}`);
      // let msg = `HTTP ${res.status}`;
      // if (res?.message) msg = typeof j.message === "string" ? j.message : JSON.stringify(j.message);
      // throw new Error(msg);
    }
    const resData = await res.json()
    return resData
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
}

export async function getAdminTransportations() {
  // const ctrl = new AbortController();
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;


  const BACKEND_URL = process.env.BACKEND_URL; // or NEXT_PUBLIC_BACKEND_URL if used in the browser
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }

  try {
    const res = await fetch(`${BACKEND_URL}/admin/transportations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      // signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json()

    return data

  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
}

export async function editOrAddAdminTransportations(formdata: any, id: number | false) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  const BACKEND_URL = process.env.BACKEND_URL
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }
  const url = id
    ? `${BACKEND_URL}/admin/transportations/${id}`
    : `${BACKEND_URL}/admin/transportations`;

  const raw = JSON.stringify({
    "zone": formdata.zone,
    "weight": formdata.weight,
    "price": formdata.price
  });
  console.log(raw)


  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type for FormData; browser sets boundary
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: raw,
    });
    const data = await res.json()
    if (!res.ok) {
      const txt = data;
      throw new Error(` ${txt.message}`);
    }
    const resData = data;
    return resData

  } catch (e: any) {
    throw new Error(`${e || "Failed to load"}`)
  }
}

export async function deleteAdminTransportations(id: number) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  const BACKEND_URL = process.env.BACKEND_URL
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }
  // console.log(`${BACKEND_URL}/admin/transportations/${id}`)
  try {
    const res = await fetch(`${BACKEND_URL}/admin/transportations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // try to surface backend error message
      // const j = await res.json();
      const txt = await res.json();
      throw new Error(` ${txt.message}`);
      // let msg = `HTTP ${res.status}`;
      // if (res?.message) msg = typeof j.message === "string" ? j.message : JSON.stringify(j.message);
      // throw new Error(msg);
    }
    const resData = await res.json()
    return resData
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
}

export async function changeOrderStatus(id: number, status: string) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  const BACKEND_URL = process.env.BACKEND_URL
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }
  // console.log(`${BACKEND_URL}/admin/orders/${id}/status`)
  try {
    const res = await fetch(`${BACKEND_URL}/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      // try to surface backend error message
      // const j = await res.json();
      const txt = await res.json();
      throw new Error(` ${txt.message}`);
      // let msg = `HTTP ${res.status}`;
      // if (res?.message) msg = typeof j.message === "string" ? j.message : JSON.stringify(j.message);
      // throw new Error(msg);
    }
    const resData = await res.json()
    return resData
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
}


export async function getAdminOrders() {
  // const ctrl = new AbortController();
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;

  const BACKEND_URL = process.env.BACKEND_URL
  if (!BACKEND_URL) {
    throw new Error("Missing BACKEND_URL in environment");
  }

  try {
    const res = await fetch(`${BACKEND_URL}/admin/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const txt = await res.json();
      throw new Error(` ${txt.message}`);
    }
    const resData = await res.json()
    return resData
  } catch (e: any) {
    throw new Error(`${e?.message || "Failed to load"}`)
  }
}
