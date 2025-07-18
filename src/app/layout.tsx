import type { Metadata } from "next";
import { Geist_Mono, Maven_Pro, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AsideProvider } from "@/context/showAsideContext";
import { LoadingProvider } from "@/context/LoadingContext";
import ClientLoaderWrapper from "@/components/loader/ClientLoaderWrapper";
import { PreviewProvider } from "@/context/PreviewContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Fonts
const mavenPro = Maven_Pro({
  variable: "--font-maven",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Voltis Labs Academy",
  description: `Voltis Labs Academy provides internship opportunities for students, graduates,
              universities and individual professionals. It allows users to create courses,
              and provides an integrated learning management system. Its offerings include
              digital course tools, study materials, IT infrastructure and other operations.`,

  openGraph: {
    title: "Voltis Labs Academy",
    description:
      "Empowering students and professionals through immersive digital learning.",
    url: "https://academy.voltislabs.com",
    siteName: "Voltis Labs",
    images: [
      {
        url: "https://academy.voltislabs.com/student.png",
        width: 1200,
        height: 630,
        alt: "Voltis Labs Academy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voltis Labs Academy",
    description: "Internships, digital learning, and career empowerment.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mavenPro.variable} ${geistMono.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        <GoogleOAuthProvider clientId={"148895792478-0cbulg7s4ohrkd3u25s3fvuo1fd1f30b.apps.googleusercontent.com"}>
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
      </body>
    </html>
  );
}
