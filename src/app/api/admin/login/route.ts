import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Clean the env vars in case they have wrapping quotes
    const expectedEmail = (process.env.Email || "").replace(/^["']|["']$/g, "");
    const expectedPassword = (process.env.Password || "").replace(/^["']|["']$/g, "");

    if (
      email &&
      password &&
      email.toLowerCase() === expectedEmail.toLowerCase() &&
      password === expectedPassword
    ) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
