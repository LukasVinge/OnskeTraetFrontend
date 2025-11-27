"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface SupabaseProviderProps {
  children: React.ReactNode;
  initialSession?: Session | null;
}

export const SupabaseProvider = ({ children, initialSession }: SupabaseProviderProps) => {
  const [supabase] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })
  );

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
};
