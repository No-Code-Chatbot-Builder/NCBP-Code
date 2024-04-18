import { AssistantType } from "@/lib/constants";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssistantState {
  assistants: AssistantType[];
}

const initialState: AssistantState = {
  assistants: [
    {
      id: "asst_oz7Hv1YHZSIYHDUDoHPboiQL",
      name: "NextJS Assistant",
      description:
        "Expert on Next.js and returns answers with high accuracy. Learn next.js from my Assistant",
      // owner: "ibrahimtariqsheikh",
      // threadId: "thread_vHHlZTEeKABQtePZidU5TpPX"
    },
    {
      id: "asst_oz7Hv1YHZSIYHDUDoHPboiQL",
      name: "Math Assistant",
      description:
        "Trained specifically on Mathematics books for more reliable answers so you can study in peace.",
      // owner: "ibrahimtariqsheikh",
      // threadId: "thread_vHHlZTEeKABQtePZidU5TpPX"
    },
    {
      id: "asst_oz7Hv1YHZSIYHDUDoHPboiQL",
      name: "IBA Entry Assistant",
      description:
        "Prepare for IBA Entry tests, ask for similar questions and get in with ease.",
      // owner: "hussainmurtaza",
      // threadId: "thread_vHHlZTEeKABQtePZidU5TpPX"
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
    setAssistant: (state, action: PayloadAction<AssistantType[]>) => {
      state.assistants = action.payload;
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

export const { addAssistant, removeAssistant, updateAssistant,setAssistant } =
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
