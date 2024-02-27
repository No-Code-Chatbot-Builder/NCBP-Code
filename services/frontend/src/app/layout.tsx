import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Amplify } from "aws-amplify";
import config from "../amplifyconfiguration.json";
import ModalProvider from "@/providers/modal-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoCodeBot.ai",
  description: "Make Custom Chatbots for your everyday tasks",
};

Amplify.configure(config);

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>{children}</ModalProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
