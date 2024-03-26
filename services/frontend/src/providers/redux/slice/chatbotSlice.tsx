import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatbotState {
  messages: string[];
}

const initialState: ChatbotState = {
  messages: [],
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = chatbotSlice.actions;

export default chatbotSlice.reducer;
