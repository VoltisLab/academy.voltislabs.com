// app/api/calendar/route.ts - Updated Version
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../auth/[...nextauth]/route"; // ✅ FIXED: Updated import path

export async function POST(req: NextRequest) {
  try {
    console.log("=== CALENDAR API DEBUG START ===");
    
    // Get both session and JWT token
    const session = await getServerSession(authOptions);
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Debug logging
    console.log("Session exists:", !!session);
    console.log("Session user:", session?.user?.email);
    console.log("Token exists:", !!token);
    console.log("Token keys:", token ? Object.keys(token) : "No token");
    console.log("Access token exists:", !!token?.accessToken);
    console.log("Refresh token exists:", !!token?.refreshToken);
    console.log("Token error:", token?.error);
    console.log("Token expires:", token?.accessTokenExpires);
    console.log("Current time:", Date.now());
    
    // Check authentication
    if (!session || !token) {
      console.log("❌ No session or token found");
      return NextResponse.json(
        { error: "No session found", debug: { hasSession: !!session, hasToken: !!token } }, 
        { status: 401 }
      );
    }

    // Check for token refresh error
    if (token.error === "RefreshAccessTokenError") {
      console.log("❌ Token refresh error detected");
      return NextResponse.json(
        { error: "Token refresh failed. Please re-authenticate." }, 
        { status: 401 }
      );
    }

    // Check if we have a valid access token
    if (!token.accessToken) {
      console.log("❌ No access token found in JWT");
      return NextResponse.json(
        { error: "No access token found. Please sign out and sign in again." }, 
        { status: 401 }
      );
    }

    // Check if token has proper expiration (if not, it's an old token)
    if (!token.accessTokenExpires) {
      console.log("❌ Token missing expiration time - old token format");
      return NextResponse.json(
        { error: "Token format outdated. Please sign out and sign in again." }, 
        { status: 401 }
      );
    }

    // Check if token is expired
    if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
      console.log("❌ Access token expired");
      return NextResponse.json(
        { error: "Access token expired. Please refresh the page." }, 
        { status: 401 }
      );
    }

    console.log("✅ Authentication checks passed");

    // Parse request body
    const body = await req.json();
    const { summary, description, start, end, recurrence } = body;
    
    console.log("Request body:", { summary, description, start, end, recurrence });

    // Validate required fields
    if (!summary || !start || !end) {
      return NextResponse.json(
        { error: "Missing required fields: summary, start, end" }, 
        { status: 400 }
      );
    }

    // Validate date formats
    try {
      new Date(start);
      new Date(end);
    } catch {
      return NextResponse.json(
        { error: "Invalid date format for start or end time" }, 
        { status: 400 }
      );
    }

    console.log("Making Google Calendar API request...");

    // Make Google Calendar API request
    const googleRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          description,
          start: { 
            dateTime: start, 
            timeZone: "Africa/Lagos" 
          },
          end: { 
            dateTime: end, 
            timeZone: "Africa/Lagos" 
          },
          ...(recurrence ? { recurrence: [recurrence] } : {}),
        }),
      }
    );

    const data = await googleRes.json();
    
    console.log("Google API response status:", googleRes.status);
    console.log("Google API response:", data);

    // Handle Google API errors
    if (!googleRes.ok) {
      console.error("❌ Google Calendar API Error:", data);
      
      // Handle specific Google API error cases
      if (googleRes.status === 401) {
        return NextResponse.json(
          { error: "Google API authentication failed. Please re-authenticate." }, 
          { status: 401 }
        );
      }
      
      if (googleRes.status === 403) {
        return NextResponse.json(
          { error: "Insufficient permissions. Please re-authenticate with calendar access." }, 
          { status: 403 }
        );
      }

      return NextResponse.json(
        { 
          error: data.error?.message || "Failed to create calendar event",
          details: process.env.NODE_ENV === 'development' ? data : undefined
        }, 
        { status: googleRes.status }
      );
    }

    console.log("✅ Calendar event created successfully");
    console.log("=== CALENDAR API DEBUG END ===");

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("❌ Calendar API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}

// Optional: Add GET method to retrieve calendar events
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!session || !token || !token.accessToken) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    if (token.error === "RefreshAccessTokenError") {
      return NextResponse.json(
        { error: "Token refresh failed. Please re-authenticate." }, 
        { status: 401 }
      );
    }

    // Get query parameters for filtering events
    const { searchParams } = new URL(req.url);
    const timeMin = searchParams.get('timeMin') || new Date().toISOString();
    const timeMax = searchParams.get('timeMax');
    const maxResults = searchParams.get('maxResults') || '10';

    // Build Google Calendar API URL
    const params = new URLSearchParams({
      timeMin,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults,
    });

    if (timeMax) {
      params.append('timeMax', timeMax);
    }

    const googleRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const data = await googleRes.json();

    if (!googleRes.ok) {
      console.error("Google Calendar API Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to fetch calendar events" }, 
        { status: googleRes.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Calendar GET API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}