import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  content: string;
  role: string;
}

interface addPayload {
  message: ChatState;
  assistantId: string;
}

interface ChatbotState {
  messages: ChatState[];
  assistantId: string;
}

const initialState: ChatbotState = {
  messages: [],
  assistantId: "",
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<addPayload>) => {
      const { message, assistantId } = action.payload;
      state.messages.push(message);
      if (state.assistantId == "") state.assistantId = assistantId

    },
    updateMessage: (state, action: PayloadAction<addPayload>) => {
      state.messages[state.messages.length - 1].content += action.payload.message;
    }
  },
});

export const { addMessage, updateMessage } = chatbotSlice.actions;

export default chatbotSlice.reducer;
