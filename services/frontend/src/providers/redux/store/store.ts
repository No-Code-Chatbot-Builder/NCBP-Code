import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../slice/modelSlice";
import authReducer from "../slice/authSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      modal: modalReducer,
      auth: authReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
