import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";
import AuthProvider from "@/providers/auth-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoCodeBot.ai",
  description: "Make Custom Assistants without writing a single line of code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(font.className, "min-h-screen font-sans antialiased ")}
      >
        <ConfigureAmplifyClientSide />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
