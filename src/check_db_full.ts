import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://olymyudvqnawyjtfzpti.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seW15dWR2cW5hd3lqdGZ6cHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDgyMDMsImV4cCI6MjA4OTIyNDIwM30.c1qscRxsnlc5F18lPi7KZ4JkxMPvAzBqUvv--5Q8pzY");

async function check() {
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  const { data: participants, error: partError } = await supabase.from('participants').select('*');
  const { data: roles, error: rError } = await supabase.from('user_roles').select('*');
  
  console.log("Profiles:", JSON.stringify(profiles, null, 2));
  console.log("Participants:", JSON.stringify(participants, null, 2));
  console.log("Roles:", JSON.stringify(roles, null, 2));
}
check();
