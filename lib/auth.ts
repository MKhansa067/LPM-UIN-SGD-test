import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "../auth.config";
import { db } from "./db";
import { lpmAdmins } from "./schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "./validations";
import { recordAuditLog } from "./audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 jam session
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { username, password } = validatedFields.data;

        try {
          const [admin] = await db
            .select()
            .from(lpmAdmins)
            .where(eq(lpmAdmins.username, username))
            .limit(1);

          if (!admin || !admin.isActive) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, admin.passwordHash);

          if (!passwordsMatch) {
            return null;
          }

          // Update last login
          await db
            .update(lpmAdmins)
            .set({ lastLogin: new Date() })
            .where(eq(lpmAdmins.id, admin.id));

          // Record audit log permanently in DB
          await recordAuditLog({
            adminId: admin.id,
            action: "LOGIN",
            targetTable: "lpm_admins",
            targetId: admin.id,
            details: `Superadmin '${admin.username}' (${admin.name}) berhasil masuk ke Dashboard`,
            ipAddress: "127.0.0.1",
          });

          return {
            id: String(admin.id),
            name: admin.name,
            email: admin.email,
            role: admin.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});

