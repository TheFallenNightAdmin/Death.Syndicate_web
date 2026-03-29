const SPOTIFY_CLIENT_ID     = '9c55ecb947c844de936e824d1116703b';
const SPOTIFY_CLIENT_SECRET = 'eb2006720aec41c3ad53504a7378f8c9';
const SPOTIFY_ARTIST_ID     = '0lt7yivQzmpsdcZ8wKuv2M';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Get access token
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`
    });
    const { access_token } = await tokenRes.json();

    // Get artist data
    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}`, {
      headers: { Authorization: `Bearer ${access_token}` }
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
