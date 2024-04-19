import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  content: string;
  role: string;
}

interface addPayload {
  message: ChatState;
  assistantId: string;
}

interface updatePayload {
  message: string;
  assistantId: string;
}

interface ChatbotState {
  threads: {
    messages: ChatState[];
    assistantId: string;
  }[];
}

const initialState: ChatbotState = {
  threads: [],
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<addPayload>) => {
      const { assistantId, message } = action.payload;

      if (
        !state.threads?.some((thread) => thread.assistantId === assistantId)
      ) {
        state.threads?.push({
          assistantId: assistantId,
          messages: [message],
        });
      } else {
        state.threads.forEach((thread) => {
          if (thread.assistantId === assistantId) {
            thread.messages.push(message);
          }
        });
      }
    },
    updateMessage: (state, action: PayloadAction<updatePayload>) => {
      const { assistantId } = action.payload;
      state.threads?.forEach((thread) => {
        if (thread.assistantId === assistantId) {
          thread.messages[thread.messages.length - 1].content +=
            action.payload.message;
        }
      });
    },
  },
});

export const { addMessage, updateMessage } = chatbotSlice.actions;

export default chatbotSlice.reducer;
