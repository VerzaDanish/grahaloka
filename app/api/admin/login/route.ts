import { NextResponse } from "next/server";

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "grahaloka2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === DEFAULT_PASSWORD) {
      const response = NextResponse.json(
        { success: true, message: "Login berhasil" },
        { status: 200 }
      );

      // Set cookie session
      response.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Password salah!" },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logout berhasil" });
  response.cookies.delete("admin_session");
  return response;
}
