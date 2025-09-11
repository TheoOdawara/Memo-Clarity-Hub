// Minimal Supabase Edge Function template (TypeScript)
// Deploy this function as `validate-attempt` and expand the logic to run deterministic replay.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, user_id, seed, actions } = body || {};

    if (!attemptId || !user_id || !seed || !Array.isArray(actions)) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_payload' }), { status: 400 });
    }

    // TODO: implement deterministic replay and scoring logic here.
    // For now, respond with ok and echo minimal info.
    return new Response(JSON.stringify({ ok: true, attemptId, serverScore: null }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'server_error', details: String(err) }), { status: 500 });
  }
}
