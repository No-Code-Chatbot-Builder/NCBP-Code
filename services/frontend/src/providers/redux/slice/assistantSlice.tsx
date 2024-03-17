import { AssistantType } from "@/lib/constants";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssistantState {
  assistants: AssistantType[];
}

const initialState: AssistantState = {
  assistants: [
    {
      id: "1",
      name: "NextJS Assistant",
      description:
        "Expert on Next.js and returns answers with high accuracy. Learn next.js from my Assistant",
      owner: "ibrahimtariqsheikh",
    },
    {
      id: "2",
      name: "Math Assistant",
      description:
        "Trained specifically on Mathematics books for more reliable answers so you can study in peace.",
      owner: "ibrahimtariqsheikh",
    },
    {
      id: "3",
      name: "IBA Entry Assistant",
      description:
        "Prepare for IBA Entry tests, ask for similar questions and get in with ease.",
      owner: "hussainmurtaza",
    },
  ],
};

export const AssistantSlice = createSlice({
  name: "assistants",
  initialState,
  reducers: {
    addAssistant: (state, action: PayloadAction<AssistantType>) => {
      state.assistants.push(action.payload);
    },
    removeAssistant: (state, action: PayloadAction<string>) => {
      state.assistants = state.assistants.filter(
        (assistant) => assistant.id !== action.payload
      );
    },
    updateAssistant: (state, action: PayloadAction<AssistantType>) => {
      const index = state.assistants.findIndex(
        (assistant) => assistant.id === action.payload.id
      );
      if (index !== -1) {
        state.assistants[index] = action.payload;
      }
    },
  },
});

export const { addAssistant, removeAssistant, updateAssistant } =
  AssistantSlice.actions;

export const getAssistantById = createSelector(
  [
    (state: { assistants: AssistantState }) => state.assistants.assistants,
    (state, assistantId: string) => assistantId,
  ],
  (assistants, assistantId) =>
    assistants.find((assistant) => assistant.id === assistantId)
);

export default AssistantSlice.reducer;
