"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import { AsideProvider } from "@/context/showAsideContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { PreviewProvider } from "@/context/PreviewContext";
import ClientLoaderWrapper from "@/components/loader/ClientLoaderWrapper";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <LoadingProvider>
          <AsideProvider>
            <PreviewProvider>
              <ClientLoaderWrapper>{children}</ClientLoaderWrapper>
            </PreviewProvider>
          </AsideProvider>
        </LoadingProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 