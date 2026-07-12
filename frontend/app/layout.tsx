import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/Provider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "TransitOps Platform",
  description: "Smart Transport Operations Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "dark", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground dark:bg-[#111111]">
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}

