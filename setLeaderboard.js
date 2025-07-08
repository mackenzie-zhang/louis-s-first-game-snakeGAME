export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  const newLeaderboard = await request.json();

  try {
    await fetch(`${KV_REST_API_URL}/set/leaderboard`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
      body: JSON.stringify(newLeaderboard),
    });

    return new Response('OK', { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update leaderboard' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
