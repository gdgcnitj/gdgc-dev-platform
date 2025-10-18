import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-w-screen place-items-center">
      <SignIn signUpUrl="/sign-in/create" />
    </div>
  );
}
