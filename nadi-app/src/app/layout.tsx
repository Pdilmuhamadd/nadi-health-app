import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Optimasi Font dari Google Fonts (Standar startup modern)
const fontSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NADI - Sistem Kesehatan Terpadu",
  description: "Platform rekam medis presisi, pemantauan AI real-time, dan akses instan ke tenaga kesehatan.",
  icons: {
    icon: "/favicon.ico", // Pastikan lu punya file favicon di folder public/
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      {/* Memasukkan variable font ke dalam body agar class 'font-sans' di Tailwind bekerja */}
      <body className={`${fontSans.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}