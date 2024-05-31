"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAssistantById } from "@/providers/redux/slice/assistantSlice";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ArrowUp, CopyIcon, Loader2 } from "lucide-react";
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
import CustomToast from "@/components/global/custom-toast";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

type Props = {
  params: {
    id: string;
  };
};

const UserMessage = ({ message }: { message: string }) => (
  <div className="flex justify-end">
    <div className="bg-card p-3 rounded-full">
      <p className="text-muted-foreground font-normal">{message}</p>
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
    <div className="flex flex-start flex-col">
      <div className="bg-card p-4 rounded-xl m-0">
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
                    variant={"ghost"}
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
                <ReactMarkdown className="whitespace-pre-wrap p-0 m-0">
                  {chunk}
                </ReactMarkdown>
              </p>
            );
          }
        })}
      </div>
      <div className="flex text-muted-foreground flex-row-reverse mr-4 mt-2">
        <Button size={"icon"} variant={"ghost"}>
          <CopyToClipboard text={message} onCopy={() => notify()}>
            {copied ? (
              <IoIosCheckmarkCircleOutline className="text-lg m-1 text-green-500 w-4 h-4" />
            ) : (
              <CopyIcon className="text-lg m-1  w-4 h-4 hover:text-white" />
            )}
          </CopyToClipboard>
        </Button>
        {/* <button className="p-1 hover:text-white">
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button className="p-1 hover:text-white">
          <ThumbsDown className="w-4 h-4" />
        </button> */}
      </div>
    </div>
  );
};

const AssistantIdByPage = ({ params }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = useAppSelector((state) =>
    state.chatbot.threads?.filter(
      (thread: any) => thread.assistantId === params.id
    )
  );
  const form = useForm();
  const currentWorkspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspace?.name
  );
  const assistant = useAppSelector((state) =>
    getAssistantById(state, params.id)
  );
  const dispatch = useAppDispatch();
  const URL = `ws://fargat-farga-opbzm5amp8ir-1656924029.us-east-1.elb.amazonaws.com?workspaceId=hussainworkspace&assistantId=asst_oHMufnVas2LVjvnpk7zLbult`;
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const [isInputDisabled, setInputDisabled] = useState(false);

  useEffect(() => {
    socketRef.current = io(URL, {
      path: "/bot/socket.io",
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
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
            assistantId: params.id,
            message: {
              role: "bot",
              content: "",
            },
          })
        );
      } else if (data.event === "textDelta") {
        dispatch(updateMessage({ assistantId: params.id, message: data.data }));
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
  }, [URL, dispatch, params.id]);

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
        socketRef.current.emit(
          "runAssistant",
          JSON.stringify({
            query: query,
            dataSetId: "7e9deafc-2192-466b-a2d2-e54985431b7c",
          })
        );
        dispatch(
          addMessage({
            assistantId: params.id,
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
    <div className="stretch mx-auto w-full md:w-3/4 max-w-5xl pt-24 pb-40">
      {messages &&
        messages[0]?.messages?.map((message: ChatState, index: number) => (
          <div key={index} className="mb-2 whitespace-pre-wrap">
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

      <div className="flex flex-col items-center justify-center bg-background w-full">
        <div className=" fixed bottom-0  px-10 pb-10 w-2/3 mx-auto">
          <div className="relative">
            <div className="">
              <form onSubmit={handleSubmit}>
                <Input
                  {...form.register("query")}
                  type="text"
                  placeholder="Ask Anything"
                  className="mt-4 border-secondary/30 bg-card rounded-full text-muted-foreground px-6 py-7 shadow-xl"
                  disabled={isInputDisabled}
                />
                <Button
                  type="submit"
                  variant={
                    form.watch("query") && form.watch("query").trim().length > 0
                      ? "default"
                      : "ghost"
                  }
                  size={"icon"}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-primary rounded-full"
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
          </div>

          <p className="text-secondary font-medium text-xs mt-2">
            Model: {assistant ? assistant.name : ""}. Generated Content may be
            incorrect or false.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AssistantIdByPage;
