// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

export async function POST() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin_token")?.value;
  console.log(token)
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/admin/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      redirect: "follow"
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json({ error: errText || "Invalid credentials" }, { status: res.status });
      // return NextResponse.json({ error: String(body.username) || "Invalid credentials" }, { status: res.status });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (err) {
    console.error("Login route error:", err);

    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}