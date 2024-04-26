"use client";

import React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import * as Popover from '@radix-ui/react-popover';
import { Cross2Icon } from '@radix-ui/react-icons';
import Image from "next/image";
import { useSearchParams } from 'next/navigation'

const Home = () => {
  const searchParams = useSearchParams();

  return (
    <div className="relative bg-white w-full h-full">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <div className="absolute right-20 bottom-20">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="shadow-xl rounded-full flex items-center justify-center " aria-label="Update dimensions">
                <Image src="/assets/ncbai.svg" alt="Chatbot" width={80} height={80} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="rounded-lg shadow-xl animate-slideUpAndFade"
                style={{ width: '570px', height: '700px' }}
                side="left"  // This sets the popover to appear to the left of the trigger
                sideOffset={10}  // You can adjust this value to increase/decrease the gap
                align="end"  // This aligns the popover to the top of the trigger
              >
                <iframe src="http://localhost:3000/chatbot?workspaceId=bubbles&assistantId=asst_vXrdPv1CtAM6h2r8fAopsY2x" height="700" width="570" title="Iframe Example"></iframe>
                {/* <ChatBot assistantId={assistantId} workspaceName={workspaceName} /> */}
                <Popover.Close className="absolute top-6 right-6 text-secondary flex items-center justify-center" aria-label="Close">
                  <Cross2Icon height={40} width={40} />
                </Popover.Close>
                <Popover.Arrow className="fill-current text-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Home;
