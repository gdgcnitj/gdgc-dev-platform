"use client";

import { authClient } from "@/lib/auth-client";
import type { User, Session } from "better-auth";
import { redirect } from "next/navigation";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type UserSignInData = {
  email: string;
  password: string;
};

type UserSignUpData = {
  name: string;
  email: string;
  password: string;
};

type AuthState = {
  user: User | null;
  session: Session | null;
  signInUser: (data: UserSignInData) => void;
  signUpUser: (data: UserSignUpData) => void;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  signInUser: (data: UserSignInData) => null,
  signUpUser: (data: UserSignUpData) => null,
  logoutUser: () => null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const current = authClient.useSession();
  const [session, setSession] = useState<{
    user: User | null;
    session: Session | null;
  }>(() => {
    if (current.error) {
      console.error(current.error);
      return { user: null, session: null };
    }
    return {
      user: current.data ? current.data.user : null,
      session: current.data ? current.data.session : null,
    };
  });

  return (
    <AuthContext.Provider
      value={{
        ...session,
        signInUser: (data: UserSignInData) => {
          authClient.signIn.email(data, {
            onSuccess: (ctx) => {
              setSession(ctx.data);
              redirect("/dashboard");
            },
            onError: (ctx) => console.error("Sign-In Error:", ctx.error),
          });
        },
        signUpUser: (data: UserSignUpData) => {
          authClient.signUp.email(data, {
            onSuccess: (ctx) => {
              setSession(ctx.data);
              redirect("/dashboard");
            },
            onError: (ctx) => console.error("Sign-Up Error:", ctx.error),
          });
        },
        logoutUser: () => {
          authClient.signOut();
          setSession({ user: null, session: null });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
