import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Simple in-memory rate limiting (resets on server restart)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Generate HMAC-signed session token
 */
function generateSessionToken(password: string): string {
  const timestamp = Date.now().toString();
  const secret = process.env.ADMIN_PASSWORD || "";
  const hmac = createHmac("sha256", secret)
    .update(`${timestamp}:${password}`)
    .digest("hex");
  
  // Format: timestamp.hmac (not the password itself)
  return Buffer.from(`${timestamp}.${hmac}`).toString("base64");
}

/**
 * Verify HMAC-signed session token
 */
function verifySessionToken(token: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [timestamp, providedHmac] = decoded.split(".");
    
    if (!timestamp || !providedHmac) return false;

    // Check if token is expired (7 days)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > COOKIE_MAX_AGE * 1000) return false;

    // Verify HMAC
    const expectedHmac = createHmac("sha256", adminPassword)
      .update(`${timestamp}:${adminPassword}`)
      .digest("hex");

    // Use timing-safe comparison to prevent timing attacks
    const providedBuffer = Buffer.from(providedHmac);
    const expectedBuffer = Buffer.from(expectedHmac);
    
    if (providedBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(providedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Check if IP is rate limited
 */
export function isRateLimited(ip: string): { limited: boolean; remainingTime?: number } {
  const attempt = loginAttempts.get(ip);
  if (!attempt) return { limited: false };

  const timeSinceLastAttempt = Date.now() - attempt.lastAttempt;
  
  // Reset if lockout duration passed
  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip);
    return { limited: false };
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return { 
      limited: true, 
      remainingTime: Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000) 
    };
  }

  return { limited: false };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string): void {
  const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  attempt.count++;
  attempt.lastAttempt = Date.now();
  loginAttempts.set(ip, attempt);
}

/**
 * Clear login attempts on successful login
 */
export function clearAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Check if current request is authenticated (for API routes)
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  
  if (!session?.value) return false;
  return verifySessionToken(session.value);
}

/**
 * Create admin session (for login)
 */
export async function createAdminSession(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || password !== adminPassword) {
    return false;
  }

  const token = generateSessionToken(password);
  const cookieStore = await cookies();
  
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return true;
}

/**
 * Destroy admin session (for logout)
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
