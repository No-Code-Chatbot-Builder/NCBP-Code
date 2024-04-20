import { configureStore } from "@reduxjs/toolkit";
import datasetReducer from "@/providers/redux/slice/datasetSlice";
import featuredReducer from "@/providers/redux/slice/featuredSlice";
import assistantReducer from "@/providers/redux/slice/assistantSlice";
import workspaceReducer from "@/providers/redux/slice/workspaceSlice";
import chatbotReducer from "@/providers/redux/slice/chatbotSlice";

export const store = configureStore({
  reducer: {
    featured: featuredReducer,
    datasets: datasetReducer,
    assistants: assistantReducer,
    workspaces: workspaceReducer,
    chatbot: chatbotReducer,
  },
});

<<<<<<< HEAD
const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["workspaces", "assistants", "datasets", "chatbot", "featured"],
};

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    let store: any = configureStore({
      reducer: persistedReducer,
    });
    store.__persistor = persistStore(store);
    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
=======
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
>>>>>>> 8173deb279e81c88256174682beca7ce7ac4ae41
