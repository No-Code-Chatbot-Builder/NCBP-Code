// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  confirmSignUp,
  fetchUserAttributes,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
import { format } from "date-fns";

interface UserState {
  user: any | null;
  isLoggedIn: boolean;
  isVerificationStep: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isVerificationStep: false,
};

export const fetchAttributesAsync = createAsyncThunk(
  "auth/fetchAttributes",
  async () => {
    const userAttributes = await fetchUserAttributes();
    return userAttributes;
  }
);

export const signupAsync = createAsyncThunk(
  "auth/signup",
  async ({
    email,
    password,
    birthdate,
    address,
  }: {
    email: string;
    password: string;
    birthdate: Date;
    address: string;
  }) => {
    const formattedBirthdate = format(birthdate, "yyyy-MM-dd");
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          birthdate: formattedBirthdate,
          address,
          preferred_username: email.split("@")[0],
          given_name: "YourGivenName",
        },
      },
    });
    return { email };
  }
);

export const verifyCodeAsync = createAsyncThunk(
  "auth/verifyCode",
  async ({ username, code }: { username: string; code: string }) => {
    await confirmSignUp({ username, confirmationCode: code });
    return;
  }
);

export const resendVerificationCodeAsync = createAsyncThunk(
  "auth/resendVerificationCode",
  async (username: string) => {
    await resendSignUpCode({ username });
    return;
  }
);

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ username, password }: { username: string; password: string }) => {
    const response = await signIn({ username, password });
    return response;
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await signOut();
  return;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributesAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.isVerificationStep = true; // Adjust
      })
      .addCase(verifyCodeAsync.fulfilled, (state) => {
        state.isVerificationStep = false;
        state.isLoggedIn = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoggedIn = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
