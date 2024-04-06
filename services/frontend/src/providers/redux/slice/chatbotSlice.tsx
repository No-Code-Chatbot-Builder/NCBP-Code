import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  content: string;
  role: string;
}

interface ChatbotState {
  messages: ChatState[];
}

const initialState: ChatbotState = {
  messages: [],
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatState>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<string>) => {
      state.messages[state.messages.length - 1].content += action.payload;
    },
  },
});

export const { addMessage ,updateMessage} = chatbotSlice.actions;

export default chatbotSlice.reducer;
