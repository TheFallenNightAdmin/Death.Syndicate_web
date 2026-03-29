const SPOTIFY_CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID     || '9c55ecb947c844de936e824d1116703b';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_ARTIST_ID     = '0lt7yivQzmpsdcZ8wKuv2M';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No token: ' + JSON.stringify(tokenData));

    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const artist = await artistRes.json();

    res.status(200).json({
      followers: artist.followers.total,
      popularity: artist.popularity
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
