import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { createDebateSchema, updateDebateSchema } from "../../../../schemas/debate.schema";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const debate = await prisma.debate.findUnique({ where: { id } });
      if (!debate) {
        return NextResponse.json(
          { error: "Debate not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(debate);
    }

    const debates = await prisma.debate.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        tags: true,
        bannerUrl: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        userId: true,
      },
    });

    return NextResponse.json(debates);
  } catch (e) {
    console.error("GET /api/debates error:", e);
    return NextResponse.json(
      { error: "Failed to fetch debates" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Ensure user exists in the database
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User does not exist" }, { status: 400 });
  }

  const body = await req.json();
  const input = {
    ...body,
    authorId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const parse = createDebateSchema(input);
  if (!parse.success) {
    console.error("POST validation error:", parse.errors || parse.error || parse);
    return NextResponse.json({ error: parse.errors || parse.error || parse }, { status: 400 });
  }

  try {
    const debate = await prisma.debate.create({
      data: {
        title: input.title,
        description: input.description,
        category: input.category,
        tags: input.tags || [],
        bannerUrl: input.bannerUrl || "",
        userId: input.authorId,
        startTime: new Date(),
        endTime: new Date(Date.now() + (input.duration || 1) * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(debate, { status: 201 });
  } catch (e) {
    console.error("POST /api/debates error:", e);
    return NextResponse.json(
      { error: "Failed to create debate" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const id = body.id;
  const updateData = Object.assign({}, body);
  delete updateData.id;

  if (!id) {
    return NextResponse.json({ error: "Missing debate id" }, { status: 400 });
  }

  const parse = updateDebateSchema(updateData);
  if (!parse.success) {
    return NextResponse.json({ error: parse.errors || parse.error || parse }, { status: 400 });
  }

  try {
    const debate = await prisma.debate.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() },
    });

    return NextResponse.json(debate);
  } catch (e) {
    console.error("PUT /api/debates error:", e);
    return NextResponse.json(
      { error: "Failed to update debate" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing debate id" }, { status: 400 });
  }

  try {
    await prisma.debate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/debates error:", e);
    return NextResponse.json(
      { error: "Failed to delete debate" },
      { status: 500 }
    );
  }
}
