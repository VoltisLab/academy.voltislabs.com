"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      window.gtag && window.gtag("config", "G-YGNQDGQ4SC", {
        page_path: pathname,
      });
    }
  }, [pathname]);
  return null;
} 