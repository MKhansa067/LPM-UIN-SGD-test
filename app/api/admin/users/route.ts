import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmAdmins } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

const sampleAdmins: AdminUser[] = [
  {
    id: 1,
    name: "Super Admin LPM",
    username: "admin_lpm",
    email: "lpm@uinsgd.ac.id",
    role: "superadmin",
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    let admins: AdminUser[] = [...sampleAdmins];

    try {
      const dbAdmins = await db.select().from(lpmAdmins).orderBy(desc(lpmAdmins.createdAt));
      if (dbAdmins && dbAdmins.length > 0) {
        admins = dbAdmins.map((a) => ({
          id: a.id,
          name: a.name,
          username: a.username,
          email: a.email,
          role: a.role,
          isActive: a.isActive,
          lastLogin: a.lastLogin ? a.lastLogin.toISOString() : null,
          createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch {
      // Offline fallback
    }

    return NextResponse.json({ success: true, data: admins, total: admins.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, email, password, role } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, Username, Email, dan Password wajib diisi" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin: AdminUser = {
      id: Date.now(),
      name,
      username,
      email,
      role: role || "admin",
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };

    try {
      const inserted = await db
        .insert(lpmAdmins)
        .values({
          name,
          username,
          email,
          passwordHash,
          role: role || "admin",
          isActive: true,
        })
        .returning();
      if (inserted && inserted.length > 0) {
        newAdmin.id = inserted[0].id;
      }
    } catch {
      sampleAdmins.unshift(newAdmin);
    }

    return NextResponse.json({ success: true, data: newAdmin }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID wajib diisi" }, { status: 400 });
    }

    const adminId = parseInt(id, 10);
    try {
      await db.delete(lpmAdmins).where(eq(lpmAdmins.id, adminId));
    } catch {
      // Offline fallback
    }

    return NextResponse.json({ success: true, message: "Admin berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}