import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BadgeToast from "@/app/components/BadgeToast";
<<<<<<< Updated upstream
import { I18nProvider } from "@/lib/i18n";
=======
import FloatingAvatarGuide from "@/app/components/FloatingAvatarGuide";
>>>>>>> Stashed changes

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vocatio | Orientación vocacional",
  description:
    "Plataforma de orientación vocacional con test, mentor IA y rutas personalizadas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
<<<<<<< Updated upstream
        <I18nProvider>
          {children}
          <BadgeToast />
        </I18nProvider>
=======
        {children}
        <BadgeToast />
        <FloatingAvatarGuide />
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
