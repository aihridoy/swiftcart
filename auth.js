import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import mongoClientPromise from "./service/mongoClientPromise";
import { dbConnect } from "./service/mongo";
import { User } from "./models/user-model";

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise, { databaseName: process.env.ENVIRONMENT }),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
      authorization: {
        params: {
          scope: "public_profile,email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "facebook" && !user.email) {
        throw new Error("Email is required. Please provide an email to continue.");
      }
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      if (token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        if (user.image) {
          token.picture = user.image;
        }
      }
      return token;
    },
  },
  debug: true,
});