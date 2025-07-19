import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/db";
import {
    argumentSchema,
    bannedWords,
    cuidString,
} from "../../../../schemas/argument.schema";
import { authOptions } from "../auth/[...nextauth]/route";

const idSchema = z.object({ id: cuidString });

const FIVE_MINUTES = 5 * 60 * 1000;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const debateId = searchParams.get("debateId");

  if (!debateId) {
    return NextResponse.json({ error: "Missing debateId" }, { status: 400 });
  }

  try {
    const argumentsList = await prisma.argument.findMany({
      where: { debateId },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { id: true, name: true, email: true, image: true } },
        votes: true,
      },
    });

    const response = argumentsList.map(function(arg) {
      return {
        ...arg,
        voteCount: arg.votes.length,
      };
    });

    return NextResponse.json(response);
  } catch (e) {
    console.error("GET /arguments error:", e);
    return NextResponse.json(
      { error: "Failed to fetch arguments" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const userId = session && session.user && session.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parse = argumentSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }

  const content = parse.data.content;
  const side = parse.data.side;
  const debateId = parse.data.debateId;

  var containsBanned = false;
  for (var i = 0; i < bannedWords.length; i++) {
    if (content.toLowerCase().indexOf(bannedWords[i]) !== -1) {
      containsBanned = true;
      break;
    }
  }

  if (containsBanned) {
    return NextResponse.json(
      { error: "Inappropriate language detected in argument" },
      { status: 400 }
    );
  }

  try {
    const argument = await prisma.argument.create({
      data: {
        content: content,
        side: side,
        debateId: debateId,
        authorId: userId,
      },
    });

    return NextResponse.json(argument, { status: 201 });
  } catch (e) {
    console.error("POST /arguments error:", e);
    return NextResponse.json(
      { error: "Failed to submit argument" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  const userId = session && session.user && session.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const id = body.id;
  var updateData = {};
  for (var key in body) {
    if (key !== "id" && Object.prototype.hasOwnProperty.call(body, key)) {
      updateData[key] = body[key];
    }
  }

  const idCheck = idSchema.safeParse({ id: id });
  if (!idCheck.success) {
    return NextResponse.json(
      { error: idCheck.error.flatten() },
      { status: 400 }
    );
  }

  const parse = argumentSchema.partial().safeParse(updateData);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }

  try {
    const existing = await prisma.argument.findUnique({ where: { id: id } });

    if (!existing || existing.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const timeDiff = Date.now() - new Date(existing.createdAt).getTime();
    if (timeDiff > FIVE_MINUTES) {
      return NextResponse.json(
        { error: "Edit window expired" },
        { status: 403 }
      );
    }

    var containsBanned = false;
    if (updateData.content) {
      for (var i = 0; i < bannedWords.length; i++) {
        if (updateData.content.toLowerCase().indexOf(bannedWords[i]) !== -1) {
          containsBanned = true;
          break;
        }
      }
    }
    if (containsBanned) {
      return NextResponse.json(
        { error: "Inappropriate content" },
        { status: 400 }
      );
    }

    const updated = await prisma.argument.update({
      where: { id: id },
      data: parse.data,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("PUT /arguments error:", e);
    return NextResponse.json(
      { error: "Failed to update argument" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  const userId = session && session.user && session.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const idCheck = idSchema.safeParse({ id: id });
  if (!id || !idCheck.success) {
    return NextResponse.json(
      { error: "Missing or invalid argument id" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.argument.findUnique({ where: { id: id } });

    if (!existing || existing.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const timeDiff = Date.now() - new Date(existing.createdAt).getTime();
    if (timeDiff > FIVE_MINUTES) {
      return NextResponse.json(
        { error: "Delete window expired" },
        { status: 403 }
      );
    }

    await prisma.argument.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /arguments error:", e);
    return NextResponse.json(
      { error: "Failed to delete argument" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
