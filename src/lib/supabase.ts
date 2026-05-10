import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://xvkorpygwxqpwolhlaap.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a29ycHlnd3hxcHdvbGhsYWFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI0MzE1OSwiZXhwIjoyMDkyODE5MTU5fQ.02ZD_urFuYE7QMH86mnzd-ToVMhZlV8i_Pw4HZDoJWo',
  {
    auth: { persistSession: false },
    db: { schema: 'public' },
  }
);

export const STORAGE_URL = 'https://xvkorpygwxqpwolhlaap.supabase.co/storage/v1/object/public';

// Helper to get public URL for a storage file
export function storageUrl(bucket: string, path: string): string {
  return `${STORAGE_URL}/${bucket}/${path}`;
}
