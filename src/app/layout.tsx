import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "PTV Tracker",
  description: "We paid taxes for these delays",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <body>
          <header className="flex justify-end items-center p-4 gap-4 h-16 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <SignedOut>
              <SignInButton>
                <button className="bg-[hsl(280,100%,70%)] text-white rounded-full font-medium text-sm h-10 px-5 hover:bg-[hsl(280,100%,60%)] transition cursor-pointer">
                  Sign In With Google
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
