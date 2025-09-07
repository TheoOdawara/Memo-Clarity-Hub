import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) {
      const key = m[1];
      let val = m[2];
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const TEST_EMAIL = process.env.TEST_EMAIL || 'theoodawara@gmail.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'Password123!';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: true }
});

(async () => {
  console.log('Trying signInWithPassword for', TEST_EMAIL);
  const res = await supabase.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD });
  console.log('signInWithPassword result:', res);

  console.log('Calling getSession()');
  const session = await supabase.auth.getSession();
  console.log('getSession result:', session);

  // Try magic link resend
  console.log('Attempting signInWithOtp (magic link)');
  const otp = await supabase.auth.signInWithOtp({ email: TEST_EMAIL });
  console.log('signInWithOtp result:', otp);

  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
