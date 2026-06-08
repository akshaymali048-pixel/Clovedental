"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export type LoginState = {
  success: boolean;
  error: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true, name: true, passwordHash: true },
  });

  if (!user) {
    return { success: false, error: "Invalid credentials" };
  }

  const valid = await compare(password, user.passwordHash);

  if (!valid) {
    return { success: false, error: "Invalid credentials" };
  }

  const session = await getSession();
  session.adminId = user.id;
  session.adminName = user.name;
  session.isLoggedIn = true;
  await session.save();

  redirect("/admin/leads");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
