import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";
import AuthProvider from "@/providers/auth-provider";
import StoreProvider from "@/providers/redux/provider/store-provider";

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
        className={clsx(
          font.className,
          "min-h-screen font-sans antialiased overflow-x-hidden "
        )}
      >
        <ConfigureAmplifyClientSide />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ModalProvider>
              <StoreProvider>{children}</StoreProvider>
            </ModalProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
