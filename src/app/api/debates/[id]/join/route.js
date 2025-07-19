import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const debateId = params.id;
  const body = await req.json();
  const side = body.side;
  if (side !== "SUPPORT" && side !== "OPPOSE") {
    return NextResponse.json({ error: "Invalid side" }, { status: 400 });
  }
  try {
    // Check if already joined
    const existing = await prisma.participant.findUnique({
      where: {
        userId_debateId: {
          userId: session.user.id,
          debateId: debateId,
        },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Already joined" }, { status: 409 });
    }
    const participant = await prisma.participant.create({
      data: {
        userId: session.user.id,
        debateId: debateId,
        side: side,
      },
    });
    return NextResponse.json(participant, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to join debate" },
      { status: 500 }
    );
  }
}
