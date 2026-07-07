import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  hashPassword,
  requireSuperAdmin,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminSchema } from "@/lib/validations/admin";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const currentAdmin = await requireSuperAdmin();
    const { id } = await params;
    const body = await request.json();
    const data = adminSchema.partial().parse(body);

    if (id === currentAdmin.id && data.active === false) {
      return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 });
    }

    const updateData: {
      name?: string;
      email?: string;
      role?: string;
      active?: boolean;
      passwordHash?: string;
    } = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.password) updateData.passwordHash = await hashPassword(data.password);

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ admin });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const currentAdmin = await requireSuperAdmin();
    const { id } = await params;

    if (id === currentAdmin.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await prisma.admin.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
