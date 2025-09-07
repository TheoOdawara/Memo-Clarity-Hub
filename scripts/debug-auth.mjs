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

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in MVP/.env');
  process.exit(1);
}

async function request(path, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

(async () => {
  const email = process.env.TEST_EMAIL || `test${Date.now()}@example.com`;
  const password = 'Password123!';

  console.log('Signing up', email);
  let r = await request('/signup', { email, password });
  console.log('signup response:', r);

  // sign out doesn't apply to REST; simulate sign in
  console.log('Signing in');
  r = await request('/token?grant_type=password', { email, password });
  console.log('signin response:', r);

  if (r.access_token) {
    console.log('Got access token. Fetching user info');
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${r.access_token}` },
    });
    console.log('user info status', userRes.status);
    console.log('user info', await userRes.json());
  }
})().catch(err => { console.error(err); process.exit(1); });
