// Create this file at: app/api/test-auth/route.ts
// This will help us debug the authentication issue

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../[...nextauth]/route"; // Adjust path as needed

export async function GET(req: NextRequest) {
  try {
    console.log("=== AUTH TEST START ===");
    
    // Check environment variables
    console.log("Environment variables:", {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      clientIdLength: process.env.GOOGLE_CLIENT_ID?.length,
      secretLength: process.env.NEXTAUTH_SECRET?.length
    });

    // Test session
    const session = await getServerSession(authOptions);
    console.log("Session:", {
      exists: !!session,
      user: session?.user,
      expires: session?.expires
    });

    // Test JWT token
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    console.log("JWT Token:", {
      exists: !!token,
      keys: token ? Object.keys(token) : null,
      hasAccessToken: !!token?.accessToken,
      hasRefreshToken: !!token?.refreshToken,
      accessTokenExpires: token?.accessTokenExpires,
      currentTime: Date.now(),
      isExpired: token?.accessTokenExpires ? Date.now() >= token.accessTokenExpires : null,
      error: token?.error
    });

    // Return debug info
    return NextResponse.json({
      session: {
        exists: !!session,
        user: session?.user?.email,
        expires: session?.expires
      },
      token: {
        exists: !!token,
        hasAccessToken: !!token?.accessToken,
        hasRefreshToken: !!token?.refreshToken,
        isExpired: token?.accessTokenExpires ? Date.now() >= token.accessTokenExpires : null,
        error: token?.error,
        expiresAt: token?.accessTokenExpires ? new Date(token.accessTokenExpires).toISOString() : null
      },
      environment: {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
      }
    });

  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json({
      error: "Auth test failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}