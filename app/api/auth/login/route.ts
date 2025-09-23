import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { username, password }

    const res = await fetch(`${process.env.BACKEND_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: String(body.username),
        password: String(body.password),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: errText || "Invalid credentials" },
        { status: res.status }
      );
    }

    // Assume backend returns { data: { token }, message }
    const { data, message } = await res.json();

    const response = NextResponse.json({ message });

    response.cookies.set({
      name: COOKIE_NAME,
      value: data.token,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 12, // 12h
    });

    return response;
  } catch (err: any) {
    console.error("Login route error:", err);

    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 }
    );
  }
}