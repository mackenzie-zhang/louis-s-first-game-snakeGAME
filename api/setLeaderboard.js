export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  console.log("API日志：setLeaderboard API 被调用");
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
  
  try {
    const newLeaderboard = await request.json();
    console.log("API日志：成功解析到前端发来的新排行榜数据:", newLeaderboard);
    
    console.log("API日志：正在向 Upstash 发送数据...");
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/leaderboard`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      },
      body: JSON.stringify(newLeaderboard),
    });

    if (!response.ok) {
        throw new Error('向 Upstash 保存数据失败');
    }

    console.log("API日志：成功保存到 Upstash，准备返回 200 OK");
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error("API日志：在 setLeaderboard API 中发生致命错误:", error);
    return new Response(JSON.stringify({ error: 'Failed to update leaderboard' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
