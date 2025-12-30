
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password as string);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.name,
          username: user.username,
          image: user.image
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
        // @ts-ignore
        session.user.username = token.username || "";
        // @ts-ignore
        session.user.image = token.image || "";
        // @ts-ignore
        session.user.name = token.name || "";
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        // @ts-ignore
        token.username = user.username;
        // @ts-ignore
        token.image = user.image;
      }

      if (trigger === "update" && session) {
        // Handle manual session update
        token.username = session.username ?? token.username;
        token.image = session.image ?? token.image;
        token.name = session.name ?? token.name;
      } else if (token.sub) {
        // Periodically sync with DB for sessions that aren't manual updates
        await dbConnect();
        const dbUser = await User.findById(token.sub).select('username image name').lean();
        if (dbUser) {
          // @ts-ignore
          token.username = dbUser.username;
          token.image = dbUser.image;
          token.name = dbUser.name;
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin", 
  },
  secret: process.env.NEXTAUTH_SECRET,
};
