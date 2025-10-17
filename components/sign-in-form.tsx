"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  FieldSet,
  FieldGroup,
  FieldLegend,
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import Image from "next/image";
import Google from "@/app/assets/google.svg";
import Github from "@/app/assets/github.svg";

import { useAuth } from "./auth-provider";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const { signInUser } = useAuth();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    signInUser(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="place-content-center place-items-center"
    >
      <Card className="w-full sm:max-w-md">
        <CardHeader className="border-b">
          <CardTitle>User Sign-In</CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <Link href="/sign-up" className="font-bold hover:underline">
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLegend>User SignIn</FieldLegend>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="user@example.org"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError>{[fieldState.error?.message]}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError>{[fieldState.error?.message]}</FieldError>
                    )}
                  </Field>
                )}
              />
              <FieldSeparator />
              <Field>
                <Button type="submit">Submit</Button>
              </Field>
            </FieldSet>
          </FieldGroup>
        </CardContent>
        <CardFooter className="border-t">
          <Field className="responsive">
            <Button className="content-center w-full" variant="default">
              <Image
                className="h-full w-auto invert-100 dark:invert-0"
                src={Google}
                alt="Google Icon"
              />
              Sign in with Google
            </Button>
            <Button className="content-center w-full" variant="default">
              <Image
                className="h-full w-auto invert-100 dark:invert-0"
                src={Github}
                alt="GitHub Icon"
              />
              Sign in with GitHub
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </form>
  );
}
