export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // 确保只处理 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 从环境变量中获取 URL 和 Token
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;

  // 增加一个检查，如果环境变量不存在，直接报错
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    return new Response(JSON.stringify({ error: 'Environment variables are not configured correctly.' }), { status: 500 });
  }

  try {
    // 解析前端发来的数据
    const newLeaderboard = await request.json();

    // 向 Upstash 发送数据
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/leaderboard`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLeaderboard),
    });

    // 检查 Upstash 的响应
    if (!response.ok) {
        // 如果 Upstash 返回错误，将错误信息也返回给前端
        const errorBody = await response.text();
        throw new Error(`Failed to save to Upstash: ${errorBody}`);
    }

    // 如果一切顺利，返回成功
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error("API Error in setLeaderboard:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
