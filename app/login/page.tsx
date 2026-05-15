import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
