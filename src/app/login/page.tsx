import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="h-dvh relative flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 px-4">
      {/* Home Icon in Top-Left Corner */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-white hover:text-gray-200 transition">
          <Home className="w-6 h-6" />
        </Link>
      </div>

      <div className="bg-white text-center rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Welcome to Serenity Hotel
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Sign in or create an account to manage your reservations.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full text-lg">
            <LoginLink postLoginRedirectURL="/reservations">Sign In</LoginLink>
          </Button>
          <Button asChild variant="outline" className="w-full text-lg">
            <RegisterLink postLoginRedirectURL="/reservations">
              Create an Account
            </RegisterLink>
          </Button>
        </div>
      </div>
    </main>
  );
}
