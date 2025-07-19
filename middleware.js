// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    '/debates/create',   // protect create route
    '/dashboard',        // add more routes if needed
  ],
};
