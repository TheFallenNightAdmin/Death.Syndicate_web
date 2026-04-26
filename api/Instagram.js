const INSTAGRAM_TOKEN = process.env.INSTAGRAM_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=followers_count,username&access_token=${INSTAGRAM_TOKEN}`
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.status(200).json({ followers: data.followers_count, username: data.username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
