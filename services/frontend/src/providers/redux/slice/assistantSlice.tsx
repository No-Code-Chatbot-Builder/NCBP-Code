import { AssistantType, DomainType, DomainsType } from "@/lib/constants";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssistantState {
  assistants: AssistantType[];
  isAssistantLoading: boolean;
}

const initialState: AssistantState = {
  assistants: [],
  isAssistantLoading: true,
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
    setDomainsToAssistant: (state, action: PayloadAction<DomainsType>) => {
      const index = state.assistants.findIndex(
        (assistant) => assistant.id === action.payload.assistantId
      );
      if (index !== -1) {
        state.assistants[index].allowedDomain = action.payload.domain;
      }
    },
    addDomainToAssistant: (state, action: PayloadAction<DomainType>) => {
      const index = state.assistants.findIndex(
        (assistant) => assistant.id === action.payload.assistantId
      );
      if (index !== -1) {
        state.assistants[index].allowedDomain.push(action.payload.domain);
      }
    },
    removeDomainFromAssistant: (state, action: PayloadAction<DomainType>) => {
      const index = state.assistants.findIndex(
        (assistant) => assistant.id === action.payload.assistantId
      );
      if (index !== -1) {
        state.assistants[index].allowedDomain = state.assistants[index].allowedDomain.filter(
          (domain) => domain !== action.payload.domain
        );
      }
    },
    updateAssistant: (state, action: PayloadAction<AssistantType>) => {
      const index = state.assistants.findIndex(
        (assistant) => assistant.id === action.payload.id
      );
      if (index !== -1) {
        state.assistants[index] = action.payload;
      }
    },
    setIsAssistantLoading: (state, action: PayloadAction<boolean>) => {
      state.isAssistantLoading = action.payload;
    },
  },
});

export const {
  addAssistant,
  removeAssistant,
  updateAssistant,
  setAssistant,
  setIsAssistantLoading,
  setDomainsToAssistant,
  addDomainToAssistant,
  removeDomainFromAssistant
} = AssistantSlice.actions;

export const getAssistantById = createSelector(
  [
    (state: { assistants: AssistantState }) => state.assistants.assistants,

    (state, assistantId: string) => assistantId,
  ],

  (assistants, assistantId) =>
    assistants.find((assistant) => assistant.id === assistantId)
);

export default AssistantSlice.reducer;
