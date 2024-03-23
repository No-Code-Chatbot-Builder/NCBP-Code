"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  confirmResetPassword,
  ConfirmResetPasswordInput,
  confirmSignUp,
  fetchAuthSession,
  fetchUserAttributes,
  FetchUserAttributesOutput,
  resendSignUpCode,
  resetPassword,
  ResetPasswordInput,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
import CustomToast from "@/components/global/custom-toast";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface LoginInput {
  username: string;
  password: string;
}

interface SignUpInput {
  email: string;
  password: string;
  birthdate: Date;
  address: string;
  preferred_username: string;
  given_name: string;
}

interface VerificationInput {
  username: string;
  code: string;
}

interface AuthContextType {
  user: FetchUserAttributesOutput | null;
  token: string;
  isLoggedIn: boolean;
  isVerificationStep: boolean;
  isPasswordReset: boolean;
  login: ({ username, password }: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  resetAuthPassword: ({ username }: ResetPasswordInput) => Promise<void>;
  confirmAuthResetPassword: ({
    username,
    newPassword,
    confirmationCode,
  }: ConfirmResetPasswordInput) => Promise<void>;
  signup: ({
    email,
    password,
    birthdate,
    address,
  }: SignUpInput) => Promise<void>;
  verifyCode: ({ username, code }: VerificationInput) => Promise<void>;
  resendVerificationCode: ({ username }: { username: string }) => Promise<void>;
}

const defaultValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  token: "",
  isVerificationStep: false,
  isPasswordReset: false,
  login: async () => {
    console.log("Logging in...");
  },
  logout: async () => {
    console.log("Logging out...");
  },
  resetAuthPassword: async () => {
    console.log("Resetting Password");
  },
  signup: async () => {
    console.log("Signing Up");
  },
  verifyCode: async () => {
    console.log("Code Verified...");
  },
  resendVerificationCode: async () => {
    console.log("Resending Verification Code...");
  },
  confirmAuthResetPassword: async () => {
    console.log("Resending Confirmation Reset Code...");
  },
};

export const AuthContext = createContext<AuthContextType>(defaultValue);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isVerificationStep, setIsVerificationStep] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const session = await fetchAuthSession();
        console.log(session.tokens?.idToken?.toString());
        console.log(session.tokens?.idToken?.payload);

        if (session) {
          setIsLoggedIn(true);
          const userAttributes = await fetchUserAttributes();
          setUser(userAttributes);
          setToken(session.tokens?.idToken?.toString() || "");
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
        setToken("");
      }
    };

    fetchAttributes();
  }, []);

  const verifyCode = async ({ username, code }: VerificationInput) => {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: username,
        confirmationCode: code,
      });
      if (isSignUpComplete) {
        setIsVerificationStep(false);
        toast("email verified");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast(
        <CustomToast title="Error Signing Up" description={error.toString()} />
      );
    }
  };

  const resendVerificationCode = async () => {
    console.log(user?.email);
    try {
      if (user?.email) {
        await resendSignUpCode({ username: user?.email });
      }
      toast(
        <CustomToast
          title="We Emailed You"
          description={`Your code is on the way. To log in, enter the code we emailed to ${user?.email}. It may take a minute to arrive.`}
        />
      );
    } catch (error: any) {
      toast(
        <CustomToast
          title="Error Sending Verification Code"
          description={error.toString()}
        />
      );
    }
  };

  const signup = async ({
    email,
    password,
    birthdate,
    address,
    preferred_username,
    given_name,
  }: SignUpInput) => {
    try {
      const formattedBirthdate = format(birthdate, "yyyy-MM-dd");

      const { isSignUpComplete } = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            birthdate: formattedBirthdate,
            address: address,
            preferred_username: preferred_username,
            given_name: given_name,
          },
        },
      });
      setUser({
        ...user,
        email: email,
        preferred_username: preferred_username,
        given_name: given_name,
      });
      if (isSignUpComplete) {
        toast(
          <CustomToast
            title="User Signed Up"
            description="Navigating to dashboard"
          />
        );
        setUser({ ...user, email: email });
        setIsVerificationStep(false);
        router.push("/dashboard");
      } else setIsVerificationStep(true);
    } catch (error: any) {
      toast(
        <CustomToast title="Error Signing Up" description={error.toString()} />
      );
    }
  };

  const login = async ({ username, password }: LoginInput) => {
    try {
      const response = await signIn({
        username: username,
        password: password,
      });
      if (response.nextStep.signInStep) {
        switch (response.nextStep.signInStep) {
          case "CONFIRM_SIGN_UP": {
            setUser({ ...user, email: username });
            setIsVerificationStep(true);
          }
        }
      }
      if (user?.isSignedIn) {
        setIsVerificationStep(false);
        toast(
          <CustomToast
            title="User Signed In"
            description="Welcome to the Dashboard Page"
          />
        );
      }
      setUser({
        ...user,
        email: username,
        preferred_username: username.split("@")[0],
      });
      setIsLoggedIn(true);
      router.push("/dashboard");
    } catch (error: any) {
      toast(
        <CustomToast title="Error signing in" description={error.toString()} />
      );
    }
  };

  const confirmAuthResetPassword = async ({
    username,
    newPassword,
    confirmationCode,
  }: ConfirmResetPasswordInput) => {
    try {
      await confirmResetPassword({ username, newPassword, confirmationCode });
      setIsPasswordReset(false);
    } catch (error: any) {
      if (error.name === "CodeMismatchException")
        toast(
          <CustomToast
            title="Invalid Code"
            description="The Code you entered is incorrect. Try again."
          />
        );
      else {
        toast(
          <CustomToast
            title="Error While Confirm Reset Password"
            description={error.toString()}
          />
        );
      }
    }
  };

  const resetAuthPassword = async ({ username }: ResetPasswordInput) => {
    try {
      await resetPassword({ username });
      setUser({
        ...user,
        email: username,
      });
      setIsPasswordReset(true);
      toast(
        <CustomToast
          title="We Emailed You a reset code"
          description={`Your code is on the way. Use this to reset your password.`}
        />
      );
    } catch (error: any) {
      console.log(error);
      if (error.name === "EmptyResetPasswordUsername")
        toast(
          <CustomToast
            title="Email is empty"
            description="You need to enter your email to reset your password"
          />
        );
      else if (error.name === "UserNotFoundException")
        toast(
          <CustomToast
            title="User Not Found"
            description="No account exists for the following username."
          />
        );
      else if (error.name === "LimitExceededException")
        toast(
          <CustomToast
            title="Limit Exceeded"
            description="Try again after some time."
          />
        );
      else {
        toast(
          <CustomToast
            title="Error While Resetting Password"
            description={error.toString()}
          />
        );
      }
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast(
        <CustomToast
          title="User Signed Out"
          description="Thank you for using NoCodeBot.ai"
        />
      );
      setIsLoggedIn(false);
      router.push("/");
    } catch (error: any) {
      toast(
        <CustomToast title="Error Signing Out" description={error.toString()} />
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        verifyCode,
        isVerificationStep,
        signup,
        resendVerificationCode,
        resetAuthPassword,
        isPasswordReset,
        confirmAuthResetPassword,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useCustomAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useCustomAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
