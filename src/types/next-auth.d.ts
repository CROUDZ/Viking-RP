import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      minecraftUUID?: string;
      minecraftPseudo?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    minecraftUUID?: string;
    minecraftPseudo?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    minecraftUUID?: string;
    minecraftPseudo?: string;
  }
}
