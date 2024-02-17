import "@/styles/globals.css";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { Providers } from "./Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
          )}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
