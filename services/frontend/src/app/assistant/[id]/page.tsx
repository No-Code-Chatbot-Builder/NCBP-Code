"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getAssistantById } from "@/providers/redux/slice/assistantSlice";
import React, { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { ChatState, addMessage, updateMessage } from "@/providers/redux/slice/chatbotSlice";



type Props = {
  params: {
    id: string;
  };
};

const UserMessage = ({ message }: { message: string }) => (
  <div>
    <div className="flex items-center gap-2">
      <User className="w-4 h-4" />
      <p className="text-lg font-bold">You</p>
    </div>
    <p>{message}</p>
  </div>
);

const ChatbotMessage = ({ message }: { message: string }) => (
  <div>
    <div className="flex items-center gap-2">
      <Image
        src="/assets/ncbai.svg"
        alt="Chatbot"
        width={40}
        height={40}
        className="w-4 h-4"
      />
      <p className="text-lg font-bold">Bot</p>
    </div>
    <p>{message}</p>
  </div>
);

const AssistantIdByPage = ({ params }: Props) => {
  const messages = useAppSelector((state) => state.chatbot.messages);

  const form = useForm();
  const workspaceName = useAppSelector(
    (state) => state.workspaces.currentWorkspaceName
  );
  const assistant = useAppSelector((state) =>
    getAssistantById(state, params.id)
  );
  const dispatch = useAppDispatch();
  const URL = `http://localhost:3004?workspaceId=demo`;
  let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;

  useEffect(() => {
    socket = io(URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.on("gptResponse", (data: any) => {
      console.log("Received data from server:", data);
      if (data.event === "textCreated") {
        dispatch(addMessage({
          role: 'bot',
          content: '',
        }));
      }
      else if (data.event === "textDelta") {
        dispatch(updateMessage(
          data.data));
      }
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [URL]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = form.getValues("query");

    try {
      if (socket && query.trim() !== '') {
        if (typeof socket !== 'undefined') {
          socket.emit('runAssistant', JSON.stringify({ query }));
          dispatch(addMessage({
            role: 'user',
            content: query,
          }));
          form.setValue("query", '');
        }
      }
    } catch (error) {
      console.error("Error running assistant: ", error);
    }
  };



  return (
    <div className="stretch mx-auto w-full md:w-3/4 max-w-5xl py-24">
      {messages.map((message: ChatState, index: number) => (
        <div key={index} className="mb-8 whitespace-pre-wrap">
          {message.role === "user" ? (
            <UserMessage message={message.content} />
          ) : (
            <ChatbotMessage message={message.content} />
          )}
        </div>

      ))}

      <div className="flex flex-col items-center justify-center">
        <div className="bg-background fixed bottom-0 w-full md:w-2/3 max-w-7xl px-10 pb-10">
          <div className="relative ">
            <form onSubmit={handleSubmit}>
              <Input
                {...form.register("query")}
                type="text"
                placeholder="Ask Anything"
                className="mt-4 border-secondary/30 bg-card rounded-lg text-muted-foreground p-6 shadow-xl"
              />
              <Send type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5 text-muted-foreground" />
            </form>
          </div>

          <p className="text-secondary font-semibold text-sm mt-2">
            Model: {assistant ? assistant.name : ""}. Generated Content may be
            incorrect or false.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AssistantIdByPage;

