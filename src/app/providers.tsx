"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";
import { AsideProvider } from "@/context/showAsideContext";
import { LoadingProvider } from "@/context/LoadingContext";
import ClientLoaderWrapper from "@/components/loader/ClientLoaderWrapper";
import { PreviewProvider } from "@/context/PreviewContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleOAuthProvider clientId="148895792478-0cbulg7s4ohrkd3u25s3fvuo1fd1f30b.apps.googleusercontent.com">
        <AuthProvider>
          <LoadingProvider>
            <AsideProvider>
              <PreviewProvider>
                <ClientLoaderWrapper>{children}</ClientLoaderWrapper>
              </PreviewProvider>
            </AsideProvider>
          </LoadingProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </SessionProvider>
  );
}
