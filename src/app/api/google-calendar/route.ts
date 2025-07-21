// app/api/calendar/route.ts (or wherever your calendar route is)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    // Get the session with proper typing
    const session = await getServerSession(authOptions);
    
    // Debug logging - remove in production
    console.log("Session exists:", !!session);
    console.log("Access token exists:", !!(session as any)?.accessToken);
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: "No session found" }, 
        { status: 401 }
      );
    }

    if (!(session as any).accessToken) {
      return NextResponse.json(
        { error: "No access token found" }, 
        { status: 401 }
      );
    }

    // Check for token refresh error
    if ((session as any).error === "RefreshAccessTokenError") {
      return NextResponse.json(
        { error: "Token refresh failed. Please re-authenticate." }, 
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { summary, description, start, end, recurrence } = body;

    // Validate required fields
    if (!summary || !start || !end) {
      return NextResponse.json(
        { error: "Missing required fields: summary, start, end" }, 
        { status: 400 }
      );
    }

    // Make Google Calendar API request
    const googleRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
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

    // Handle Google API errors
    if (!googleRes.ok) {
      console.error("Google Calendar API Error:", data);
      return NextResponse.json(
        { 
          error: data.error?.message || "Failed to create calendar event",
          details: data 
        }, 
        { status: googleRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("Calendar API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}