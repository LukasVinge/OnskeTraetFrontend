"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // CHANGED
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface SupabaseProviderProps {
  children: React.ReactNode;
  initialSession?: Session | null;
}

export const SupabaseProvider = ({ children, initialSession }: SupabaseProviderProps) => {
  if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("CRITICAL ERROR: Supabase URL is missing!");
  }

  const [supabase] = useState(() =>
    createClientComponentClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  );

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
};