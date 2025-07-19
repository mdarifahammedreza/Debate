import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../lib/db";

// Helper to extract image from Google profile
function getGoogleImage(user, profile) {
  if (user && user.image) return user.image;
  if (
    profile &&
    typeof profile === "object" &&
    "picture" in profile &&
    typeof profile.picture === "string"
  ) {
    return profile.picture;
  }
  return null;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !user.email) return false;
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name ?? (profile && profile.name) ?? "Anonymous",
              email: user.email,
              image: getGoogleImage(user, profile),
            },
          });
        }
        return true;
      } finally {
        await prisma.$disconnect();
      }
    },
    async jwt({ token, user }) {
      const email = (user && user.email) || token.email;
      if (!email) return token;
      try {
        let dbUser = await prisma.user.findUnique({ where: { email } });
        if (!dbUser && user) {
          dbUser = await prisma.user.create({
            data: {
              name: user.name || "Anonymous",
              email,
              image: getGoogleImage(user),
            },
          });
        }
        if (dbUser) {
          token.sub = dbUser.id;
          token.email = dbUser.email;
        }
        return token;
      } finally {
        await prisma.$disconnect();
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : null;
        session.user.email = token.email ?? null;
      }
      return session;
    },
  },
};

export default authOptions; 