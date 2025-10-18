"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/index";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export type UserSignInData = {
  email: string;
  password: string;
};
export type UserSignUpData = {
  email: string;
  password: string;
  name: string;
};

export const signInAction = async (data: UserSignInData) => {
  try {
    await auth.api.signInEmail({
      body: data,
    });
    toast.success("Welcome back! 👋");
  } catch (error) {
    toast.error("email sign in error: " + (error as Error).message);
  } finally {
    console.log(
      await auth.api.getSession({
        headers: await headers(),
      })
    );
    redirect("/dashboard");
  }
};

export const signUpAction = async (data: UserSignUpData) => {
  try {
    await auth.api.signUpEmail({
      body: data,
    });
    toast.success("Account created successfully! 🎉");
  } catch (error) {
    toast.error("email sign up error: " + (error as Error).message);
  } finally {
    redirect("/dashboard");
  }
};

export const signOutAction = async () => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    toast.success("Signed out successfully! 👋");
  } catch (error) {
    toast.error("sign out error: " + (error as Error).message);
  } finally {
    redirect("/");
  }
};