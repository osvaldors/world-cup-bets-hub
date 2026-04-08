import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://olymyudvqnawyjtfzpti.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seW15dWR2cW5hd3lqdGZ6cHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDgyMDMsImV4cCI6MjA4OTIyNDIwM30.c1qscRxsnlc5F18lPi7KZ4JkxMPvAzBqUvv--5Q8pzY");

async function check() {
  const p = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const part = await supabase.from('participants').select('*', { count: 'exact', head: true });
  const r = await supabase.from('user_roles').select('*', { count: 'exact', head: true });
  
  console.log("Profiles count:", p.count);
  console.log("Participants count:", part.count);
  console.log("Roles count:", r.count);
  
  const { data: roles } = await supabase.from('user_roles').select('*');
  console.log("Roles data:", roles);
}
check();
