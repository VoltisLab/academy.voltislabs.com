// File: lib/auth.ts
// This keeps your existing functionality + adds calendar features

import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extend types
declare module "next-auth" {
  interface Session {
    accessToken?: string; // Keep your existing accessToken
    error?: "RefreshAccessTokenError";
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

// Token refresh function
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("🔄 Refreshing access token");
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
      console.error("❌ Token refresh failed:", refreshedTokens);
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
    console.error("❌ Error refreshing access token:", error);
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
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          // Enhanced: Add calendar scope to your existing setup
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Keep your existing session callback + add error handling
    async session({ session, token }: { session: any; token: any }) {
      // Your original functionality
      session.accessToken = token.accessToken;
      
      // New: Add error handling
      if (token.error) {
        session.error = token.error;
      }
      
      return session;
    },
    
    // Keep your existing JWT callback + add refresh functionality
    async jwt({ token, account }: { token: any; account?: any }): Promise<JWT> {
      // Your original functionality
      if (account) {
        token.accessToken = account.access_token;
        
        // New: Also store refresh token for calendar functionality
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : undefined;
      }

      // New: Add token refresh logic
      if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
        if (token.refreshToken) {
          return refreshAccessToken(token);
        } else {
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }
      }

      return token;
    },
  },
};