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
import { authClient } from "@/lib/auth-client";
import { useAuth } from "./auth-provider";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUpForm() {
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

  const { signUpUser } = useAuth();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    signUpUser({
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="place-content-center place-items-center"
    >
      <Card className="w-full sm:max-w-md">
        <CardHeader className="border-b">
          <CardTitle>User Sign-Up</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold hover:underline">
              Sign In
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Image className="h-full w-auto" src={Google} alt="Google Icon" />
              Sign in with Google
            </Button>
            <Button className="content-center w-full" variant="default">
              <Image className="h-full w-auto" src={Github} alt="GitHub Icon" />
              Sign in with GitHub
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </form>
  );
}
