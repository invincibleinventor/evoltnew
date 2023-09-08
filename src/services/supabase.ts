import { createClient } from '@supabase/supabase-js'
import {$} from '@builder.io/qwik'
// Create a single supabase client for interacting with your database
export const supabase = createClient('https://bawaoafrntylqfrxnsby.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd2FvYWZybnR5bHFmcnhuc2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxMzg3NzQsImV4cCI6MjAwODcxNDc3NH0.Aq7JjfTXJqEBzRQyMD6VJUGDhFdpfQQ8LfZ8MV6AsZk')


export const setSupabaseCookie = $(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        // delete cookies on sign out
        const expires = new Date(0).toUTCString();
        document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
        document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
      }
    });
  });