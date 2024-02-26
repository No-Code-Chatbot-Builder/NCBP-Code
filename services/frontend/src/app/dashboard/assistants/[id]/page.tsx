"use client";

import { AssistantType, dummyAssistant } from "@/lib/constants";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

const DatasetByIdPage = ({ params }: Props) => {
  const [assistant, setAssistant] = useState<AssistantType | null>(null);

  useEffect(() => {
    const fetchedAssistant = dummyAssistant.find((d) => d.id === params.id);
    if (fetchedAssistant) {
      setAssistant(fetchedAssistant);
    }
  }, [params.id]);

  if (!assistant) {
    return <p>Assistant not found</p>;
  }

  return (
    <div>
      <h2>{assistant.name}</h2>
      <p>{assistant.description}</p>
    </div>
  );
};

export default DatasetByIdPage;
