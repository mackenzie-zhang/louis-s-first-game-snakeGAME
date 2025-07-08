export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;

  try {
    const response = await fetch(`${KV_REST_API_URL}/get/leaderboard`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
    });

    const data = await response.json();
    const leaderboard = JSON.parse(data.result) || [];

    return new Response(JSON.stringify(leaderboard), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
