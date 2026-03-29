const GUILD_ID = '1385497885780742224';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const response = await fetch(`https://discord.com/api/v10/invites/UjhMSnWWsQ?with_counts=true`);
    const data = await response.json();

    res.status(200).json({
      members: data.approximate_member_count ?? 0,
      online: data.approximate_presence_count ?? 0
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
