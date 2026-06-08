"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const initialState: LoginState = {
  success: false,
  error: "",
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#1e3a5f]">Clove Dental</h1>
          <p className="mt-2 text-sm text-slate-600">Admin sign in</p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@smilecare.in"
          />

          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />

          {state.error ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" variant="secondary" fullWidth disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
