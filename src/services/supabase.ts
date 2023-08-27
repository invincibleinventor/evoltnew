import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://bawaoafrntylqfrxnsby.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd2FvYWZybnR5bHFmcnhuc2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxMzg3NzQsImV4cCI6MjAwODcxNDc3NH0.Aq7JjfTXJqEBzRQyMD6VJUGDhFdpfQQ8LfZ8MV6AsZk')
