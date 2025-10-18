"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import Link from "next/link";

import Github from "@/app/assets/github.svg";
import Google from "@/app/assets/google.svg";
import Image from "next/image";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { signUpAction } from "@/app/actions/auth";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    signUpAction({
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Sign into the Developer Platform
          </CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold hover:outline">
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <div className="flex flex-between">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>First Name</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="John"
                          autoComplete="off"
                        />
                        <FieldError>
                          {fieldState.error && fieldState.error.message}
                        </FieldError>
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="ml-4">
                        <FieldLabel>Last Name</FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="Doe"
                          autoComplete="off"
                        />
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="user@example.org"
                        autoComplete="off"
                      />
                      <FieldError>
                        {fieldState.error && fieldState.error.message}
                      </FieldError>
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
                      <FieldError>
                        {fieldState.error && fieldState.error.message}
                      </FieldError>
                    </Field>
                  )}
                />
                <Field>
                  <Button type="submit">Submit</Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field className="responsive">
            <Button
              className="content-center w-full"
              variant="outline"
              onClick={async ($) => {
                await authClient.signIn.social(
                  { provider: "google" },
                  {
                    onSuccess: () => {
                      toast.success("Signed in using Google! 🎉");
                    },
                    onError: ({ error }) => {
                      toast.error("Google sign in error: " + error.message);
                    },
                  }
                );
              }}
            >
              <Image
                className="h-full w-auto dark:invert-100"
                src={Google}
                alt="Google Icon"
              />
              Sign in with Google
            </Button>
            <Button
              className="content-center w-full"
              variant="outline"
              onClick={async ($) => {
                await authClient.signIn.social(
                  { provider: "github" },
                  {
                    onSuccess: () => {
                      toast.success("Signed in using GitHub! 🎉");
                    },
                    onError: ({ error }) => {
                      toast.error("GitHub sign in error: " + error.message);
                    },
                  }
                );
              }}
            >
              <Image
                className="h-full w-auto dark:invert-100"
                src={Github}
                alt="GitHub Icon"
              />
              Sign in with GitHub
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
