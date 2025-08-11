import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto max-w-md p-8">
      <SignIn routing="hash" />
    </div>
  );
} 