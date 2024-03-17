"use client";

import { useAppSelector } from "@/lib/hooks";
import { getAssistantById } from "@/providers/redux/slice/assistantSlice";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

const AssistantIdByPage = ({ params }: Props) => {
  const assistant = useAppSelector((state) =>
    getAssistantById(state, params.id)
  );

  return (
    <div>
      <h2>{assistant && assistant.name}</h2>
      <p>{assistant && assistant.description}</p>
    </div>
  );
};

export default AssistantIdByPage;
