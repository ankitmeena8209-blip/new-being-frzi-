import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || "im_ankiit";
    const expectedPass = process.env.ADMIN_PASSWORD || "82090760107200ankitbeingfrzi";

    if (username === expectedUser && password === expectedPass) {
      const response = NextResponse.json({ success: true, message: "Logged in successfully" });
      
      // Set secure auth cookie valid for 7 days
      response.cookies.set("admin_session", "authenticated_session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid admin username or password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
