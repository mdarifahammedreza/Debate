import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        arguments: {
          select: {
            votes: true,
          },
        },
      },
    });
    // Calculate total votes per user
    const result = leaderboard
      .map(function(user) {
        return {
          id: user.id,
          name: user.name,
          image: user.image,
          totalVotes: user.arguments.reduce(function(sum, arg) {
            return sum + arg.votes.length;
          }, 0),
        };
      })
      .sort(function(a, b) {
        return b.totalVotes - a.totalVotes;
      });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
