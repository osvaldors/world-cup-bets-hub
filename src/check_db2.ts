import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://olymyudvqnawyjtfzpti.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seW15dWR2cW5hd3lqdGZ6cHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDgyMDMsImV4cCI6MjA4OTIyNDIwM30.c1qscRxsnlc5F18lPi7KZ4JkxMPvAzBqUvv--5Q8pzY");

async function check() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log("Current session:", session); // It will be null without local storage, but this script runs server-side
  
  // We can't query auth.users without service_role key, but we can query profiles
  const { data: profiles, error: pError } = await supabase.from('profiles').select('id, user_id, email, participant_id');
  console.log("All Profiles:", profiles);
  console.log("Profiles error:", pError);
}
check();
