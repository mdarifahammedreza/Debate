import NextAuthDefault from "next-auth";
import authOptions from "../../../../../lib/authOptions";

const handler = NextAuthDefault(authOptions);
export { handler as GET, handler as POST };

