import { configureStore } from "@reduxjs/toolkit";
import datasetReducer from "@/providers/redux/slice/datasetSlice";
import featuredReducer from "@/providers/redux/slice/featuredSlice";
import assistantReducer from "@/providers/redux/slice/assistantSlice";
import workspaceReducer from "@/providers/redux/slice/workspaceSlice";
import chatbotReducer from "@/providers/redux/slice/chatbotSlice";
import modelReducer from "@/providers/redux/slice/modelSlice";

export const store = configureStore({
  reducer: {
    featured: featuredReducer,
    datasets: datasetReducer,
    assistants: assistantReducer,
    workspaces: workspaceReducer,
    chatbot: chatbotReducer,
    customModel : modelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
