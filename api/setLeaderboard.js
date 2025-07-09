export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // --- 开始硬编码调试区 ---
  // 请将下面的 "https://..." 和 "your-long-secret..." 替换为您自己的真实值
  const MY_URL = "https://mighty-poodle-14311.upstash.io";
  const MY_TOKEN = "ATfnAAIjcDE5Mz...（这里换成您自己的完整Token）";
  // --- 结束硬编码调试区 ---

  // 确保只处理 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 解析前端发来的数据
    const newLeaderboard = await request.json();

    // 注意：这里使用的是我们刚刚在上面定义的 MY_URL 和 MY_TOKEN
    const response = await fetch(`${MY_URL}/set/leaderboard`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLeaderboard),
    });

    // 检查 Upstash 的响应
    if (!response.ok) {
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
