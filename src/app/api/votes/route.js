import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const argumentId = searchParams.get("argumentId");
  try {
    if (!argumentId) {
      return NextResponse.json(
        { error: "Missing argumentId" },
        { status: 400 }
      );
    }
    const votes = await prisma.vote.findMany({
      where: { argumentId },
    });
    return NextResponse.json(votes);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  // Raw JS validation for voteSchema
  if (!body.argumentId || typeof body.argumentId !== "string") {
    return NextResponse.json({ error: { argumentId: "argumentId is required and must be a string" } }, { status: 400 });
  }
  const argumentId = body.argumentId;
  try {
    // Check if user already voted for this argument
    const existing = await prisma.vote.findUnique({
      where: {
        userId_argumentId: {
          userId: session.user.id,
          argumentId,
        },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }
    const vote = await prisma.vote.create({
      data: {
        userId: session.user.id,
        argumentId,
      },
    });
    return NextResponse.json(vote, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const argumentId = searchParams.get("argumentId");
  if (!argumentId) {
    return NextResponse.json({ error: "Missing argumentId" }, { status: 400 });
  }
  try {
    await prisma.vote.delete({
      where: {
        userId_argumentId: {
          userId: session.user.id,
          argumentId,
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to remove vote" },
      { status: 500 }
    );
  }
}
