"use client";

import { useAppDispatch, useAppSelector } from "@/app/_components/hooks";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/app/_components/ui/input";
import {
  ArrowUp,
  CopyIcon,
  Loader2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  ChatState,
  addMessage,
  updateMessage,
} from "@/providers/redux/slice/chatbotSlice";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "sonner";
import CustomToast from "@/app/_components/global/custom-toast";
import { Button } from "@/app/_components/ui/button";
import { ModeToggle } from "./global/mode-toggle";


type Props = {
  assistantId: string;
  workspaceName: string;
};

const UserMessage = ({ message }: { message: string }) => (
  <div>
    <div className="flex items-center gap-2">
      <Image src="/assets/ncbai.svg" alt="Chatbot" width={35} height={35} />
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  </div>
);

const customStyle = {
  lineHeight: "1.5",
  fontSize: "1.2rem",
  borderRadius: "5px",
  backgroundColor: "#020024",
  padding: "20px",
};

const ChatbotMessage = ({ message }: { message: string }) => {
  const [copied, setCopied] = useState(false);
  const hasCode = message?.includes("<code>") && message.includes("</code>");
  let chunks: string[] = [message];

  if (hasCode) {
    chunks = message.split(/(<code>[\s\S]*?<\/code>)/g);
  }

  const copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };
  const notify = () => {
    copy();
    toast(
      CustomToast({
        title: "Copied to clipboard !",
        description: "",
      })
    );
  };
  return (
    <div>
      <div className="mb-4 bg-card p-6 py-8 rounded-xl text-muted-foreground font-medium tracking-wide leading-snug border border-primary">
        {chunks.map((chunk, index) => {
          if (
            hasCode &&
            chunk.startsWith("<code>") &&
            chunk.endsWith("</code>")
          ) {
            const codeContent = chunk.slice(7, -8);
            return (
              <>
                <div className="relative">
                  <Button
                    className="absolute top-4 right-2 p-2"
                    size={"icon"}
                    variant={"outline"}
                  >
                    <CopyToClipboard text={codeContent} onCopy={() => notify()}>
                      {copied ? (
                        <IoIosCheckmarkCircleOutline className="text-lg m-1 text-green-500 w-4 h-4" />
                      ) : (
                        <CopyIcon className="text-lg m-1  w-4 h-4 hover:text-white" />
                      )}
                    </CopyToClipboard>
                  </Button>
                </div>
                <SyntaxHighlighter
                  key={index}
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={customStyle}
                  showLineNumbers
                >
                  {codeContent}
                </SyntaxHighlighter>
              </>
            );
          } else {
            return (
              <p key={index} className="text-base font-medium">
                {chunk}
              </p>
            );
          }
        })}
      </div>
      <div className="flex text-muted-foreground flex-row-reverse mr-4">
        <button className="p-1 hover:text-white">
          <CopyIcon className="w-4 h-4" />
        </button>
        <button className="p-1 hover:text-white">
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button className="p-1 hover:text-white">
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ChatBot = (params: Props) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messages = useAppSelector((state) => state.chatbot.messages);
  const form = useForm();
  const dispatch = useAppDispatch();
  const URL = `http://localhost:3004?workspaceId=${params.workspaceName}&assistantId=${params.assistantId}`;
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const [isInputDisabled, setInputDisabled] = useState(false);

  useEffect(() => {
    socketRef.current = io(URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log(URL);
      console.log("Connected to socket server");
      setInputDisabled(false);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setInputDisabled(true);
    });

    socketRef.current.on("gptResponse", (data: any) => {
      console.log("Received data from server:", data);
      if (data.event === "textCreated") {
        dispatch(
          addMessage({
            assistantId: params.assistantId,
            message: {
              role: "bot",
              content: "",
            },
          })
        );
      } else if (data.event === "textDelta") {
        dispatch(updateMessage({ assistantId: params.assistantId, message: data.data }));
        setInputDisabled(false);
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => {
      //cleaning function
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [URL, dispatch, params.assistantId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = form.getValues("query");
    if (query.trim() === "") {
      console.error("Query cannot be empty.");
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    setInputDisabled(true);
    try {
      if (socketRef.current) {
        console.log("emitting .....");
        socketRef.current.emit("runAssistant", JSON.stringify({ query }));
        dispatch(
          addMessage({
            assistantId: params.assistantId,
            message: {
              role: "user",
              content: query,
            },
          })
        );
        form.setValue("query", "");
      }
    } catch (error) {
      console.error("Error running assistant: ", error);
      setInputDisabled(false);
    }
  };

  return (
    <div className=" rounded-lg ring-4 ring-ring relative bg-background w-full h-full pt-24">
      <div  className="absolute top-6 left-6">
        <ModeToggle/>
        {/* <ArrowUp className="w-10 h-10 text-foreground" /> */}
        <p></p>
      </div>
      <div className="scrollable-messages max-h-[500px] px-4 overflow-y-auto">
        {messages &&
          messages.map((message: ChatState, index: number) => (
            <div key={index} className="mb-8 whitespace-pre-wrap px-4">
              {message.role === "user" ? (
                <>
                  <UserMessage message={message.content} />
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <>
                  <ChatbotMessage message={message.content} />
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          ))}
      </div>
      <div className="rounded-md absolute bg-background bottom-0 w-full max-w-3xl px-10 pb-10">
        <div className="relative">
          <form onSubmit={handleSubmit}>
            <Input
              {...form.register("query")}
              type="text"
              placeholder="Ask Anything"
              className="mt-4 border-secondary/30 bg-card rounded-lg text-muted-foreground px-6 py-7 shadow-xl"
              disabled={isInputDisabled}
            />
            <Button
              type="submit"
              variant={form.watch("query") && form.watch("query").trim().length > 0 ? "default" : "ghost"}
              size={"icon"}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-primary"
              disabled={isInputDisabled}
            >
              {isInputDisabled ? (
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>
          </form>
        </div>
        <p className="text-secondary font-medium text-xs mt-2">
          Model: ${params.assistantId}. Generated Content may be
          incorrect or false.
        </p>
      </div>
    </div>

  );

  
};
export default ChatBot;

<style jsx>{`
 .scrollable-messages {
  overflow-y: auto;
  max-height: 75vh; /* Adjust based on your layout needs */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scrollable-messages::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}

`}</style>
