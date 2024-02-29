import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoCodeBot.ai",
  description: "Make Custom Assistants without writing a single line of code.",
  authors: [
    { name: "NCBPTeam", url: "https://github.com/No-Code-Chatbot-Builder" },
  ],
  // openGraph: {
  //   type: "website",
  //   url: "https://nocodebotai.vercel.app/",
  //   title: "NoCodeBot.ai",
  //   description:
  //     "Create Custom Chat Assistants without writing a single line of code. NoCodeBot.ai personalizes your assistant so you can retrieve custom information with ease. Made by students in IBA from Karachi, Pakistan",
  //   siteName: "NoCodeBot.ai",
  //   images: [
  //     {
  //       url: "https://i.ibb.co/L06VyVW/Github-Prreview.png",
  //     },
  //   ],
  // },
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
          <ModalProvider>{children}</ModalProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
