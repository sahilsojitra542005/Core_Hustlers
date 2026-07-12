import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/Provider";

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
      className={`font-sans h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground dark:bg-[#111111]">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

