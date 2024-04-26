import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/providers/theme-provider";
// import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/providers/redux/provider/store-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoCodeBot.ai Chatbot",
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
          "font-sans antialiased overflow-x-hidden w-full"
        )}
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            {children}
          </StoreProvider>
          {/* <Toaster /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
