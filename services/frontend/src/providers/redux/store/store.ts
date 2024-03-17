import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import datasetReducer from "@/providers/redux/slice/datasetSlice";
import featuredReducer from "@/providers/redux/slice/featuredSlice";
import assistantReducer from "@/providers/redux/slice/assistantSlice";

const rootReducer = combineReducers({
  featured: featuredReducer,
  datasets: datasetReducer,
  assistants: assistantReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["datasets", "featured", "assistants"],
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
