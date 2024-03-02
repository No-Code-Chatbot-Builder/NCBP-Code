"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  confirmSignUp,
  fetchUserAttributes,
  FetchUserAttributesOutput,
  resendSignUpCode,
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
}

interface VerificationInput {
  username: string;
  code: string;
}

interface AuthContextType {
  user: FetchUserAttributesOutput | null;
  isLoggedIn: boolean;
  isVerificationStep: boolean;
  login: ({ username, password }: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
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
  isVerificationStep: false,
  login: async () => {
    console.log("Logging in...");
  },
  logout: async () => {
    console.log("Logging out...");
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

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        setUser(userAttributes);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };

    fetchAttributes();
  }, []);

  const getUser = async () => {
    const userAttributes = await fetchUserAttributes();
    setUser(userAttributes);
  };

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
            preferred_username: email.split("@")[0],
            given_name: "YourGivenName",
          },
        },
      });
      setUser({ ...user, email: email });
      if (isSignUpComplete) {
        toast(
          <CustomToast
            title="User Signed Up"
            description="Navigating to dashboard"
          />
        );
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
      setIsLoggedIn(true);
      router.push("/dashboard");
    } catch (error: any) {
      toast(
        <CustomToast title="Error signing in" description={error.toString()} />
      );
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
