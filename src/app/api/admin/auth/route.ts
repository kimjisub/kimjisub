import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Set session cookie
    const cookieStore = await cookies();
    const sessionToken = Buffer.from(`${Date.now()}:${adminPassword}`).toString("base64");
    
    cookieStore.set(ADMIN_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE);
    
    if (!session?.value) {
      return NextResponse.json({ authenticated: false });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ authenticated: false });
    }

    // Verify session
    try {
      const decoded = Buffer.from(session.value, "base64").toString();
      const [, storedPassword] = decoded.split(":");
      
      if (storedPassword === adminPassword) {
        return NextResponse.json({ authenticated: true });
      }
    } catch {
      // Invalid session format
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error("Admin auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
