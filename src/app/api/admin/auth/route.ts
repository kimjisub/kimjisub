import { NextRequest, NextResponse } from "next/server";
import { 
  isAuthenticated, 
  createAdminSession, 
  destroyAdminSession,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/admin-auth";

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    // Check rate limit
    const rateLimit = isRateLimited(ip);
    if (rateLimit.limited) {
      return NextResponse.json(
        { 
          error: "Too many login attempts", 
          retryAfter: rateLimit.remainingTime 
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const success = await createAdminSession(password);

    if (!success) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    clearAttempts(ip);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// GET /api/admin/auth - Check auth status
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error("Admin auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  try {
    await destroyAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
