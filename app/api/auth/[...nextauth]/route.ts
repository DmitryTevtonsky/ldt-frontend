import { passportFetcher } from "core/fetchers";
import { JsonRpcBody, User } from "core/types";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const NextAuthHandler = NextAuth({
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/signin",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt({ token, user, account, profile, session, trigger }) {
			// console.log("jwt=", { token, user, account, profile, session, trigger });
			return { ...token, ...user };
		},
		session({ session, token, user, trigger }) {
			// console.log("session=", { token, user, session, trigger });
			session.user = token;

			return session;
		},
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "E-mail", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const { data: loginData } = await passportFetcher.post<JsonRpcBody<string>>(
						"/",
						{
							method: "login",
							email: credentials?.email,
							password: credentials?.password,
						}
					);

					console.log("loginData=", loginData.result);

					if (loginData.error || !loginData.result) return null;

					const { data: profileData } = await passportFetcher.post<JsonRpcBody<User>>(
						"/",
						{ method: "my_profile" },
						{ headers: { "Authorization": loginData.result } }
					);

					console.log("profileData=", profileData);

					if (profileData.error || !profileData.result) return null;

					return {
						...profileData.result,
						accessToken: loginData.result,
					};
				} catch (error: unknown) {
					console.log("auth error=", error);

					return null;
				}
			},
		}),
	],
});

export { NextAuthHandler as GET, NextAuthHandler as POST };
