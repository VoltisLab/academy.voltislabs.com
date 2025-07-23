// File: app/api/auth/[...nextauth]/route.ts
// This extends your existing config without breaking current functionality

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extend NextAuth types (this won't break existing functionality)
declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError";
    accessToken?: string; // Keep your existing accessToken in session for backward compatibility
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
  }
}

// Function to refresh the access token (new functionality)
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = "https://oauth2.googleapis.com/token";
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", refreshedTokens);
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Enhanced scopes for calendar access
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // Keep your existing session callback for backward compatibility
      session.accessToken = token.accessToken;
      
      // Add error handling for calendar functionality
      if (token.error) {
        session.error = token.error;
      }
      
      return session;
    },
    async jwt({ token, account }: { token: any; account?: any }): Promise<JWT> {
      // Enhanced JWT callback that maintains existing functionality
      if (account) {
        // Log enhanced token info for debugging
        console.log("✅ Enhanced sign in - account data:", {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          expiresAt: account.expires_at
        });
        
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token, // New: store refresh token
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined, // New: store expiration
        };
      }

      // New: Check if token needs refresh
      if (
        token.accessTokenExpires && 
        Date.now() < token.accessTokenExpires
      ) {
        return token; // Token still valid
      }

      // New: Try to refresh expired token
      if (token.refreshToken) {
        console.log("🔄 Refreshing expired token");
        return refreshAccessToken(token);
      }

      // Fallback: return token as-is (maintains existing behavior)
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };