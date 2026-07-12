// Edge-safe auth config: no Node-only imports (mongoose, mongodb-adapter, bcrypt)
// so it can run in Next.js middleware (Edge runtime). The full config with
// providers and DB access lives in auth.js.
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      if (token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        if (user.image) {
          token.picture = user.image;
        }
      }
      return token;
    },
  },
  providers: [],
};
