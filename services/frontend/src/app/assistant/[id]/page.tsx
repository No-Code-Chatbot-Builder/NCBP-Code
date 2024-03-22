"use client";

import { useAppSelector } from "@/lib/hooks";
import { getAssistantById } from "@/providers/redux/slice/assistantSlice";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import { Message, useChat } from "ai/react";
import Image from "next/image";

type Props = {
  params: {
    id: string;
  };
};

const UserMessage = ({ message }: { message: Message }) => (
  <div>
    <div className="flex items-center gap-2">
      <User className="w-4 h-4" />
      <p className="text-xl font-bold">You</p>
    </div>
    <p>{message.content}</p>
  </div>
);

const ChatbotMessage = ({ message }: { message: Message }) => (
  <div>
    <Image
      src="/assets/ncbai.svg"
      alt="Chatbot"
      width={40}
      height={40}
      className="w-4 h-4"
    />
    <p>{message.content}</p>
  </div>
);

const AssistantIdByPage = ({ params }: Props) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const assistant = useAppSelector((state) =>
    getAssistantById(state, params.id)
  );

  return (
    <div className="mt-20 stretch mx-auto w-full md:w-1/2 max-w-4xl py-24">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? (
            <UserMessage message={m} />
          ) : (
            <ChatbotMessage message={m} />
          )}
        </div>
      ))}

      <div className="flex flex-col items-center justify-center">
        <div className="fixed bottom-10 w-full md:w-1/2 max-w-4xl px-10">
          <div className="relative">
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Anything"
                className="mt-4 border-secondary/30 bg-card rounded-lg text-muted-foreground p-6 shadow-xl"
              />
              <Send className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5 text-muted-foreground" />
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
