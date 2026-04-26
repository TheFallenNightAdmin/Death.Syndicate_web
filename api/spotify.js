const SPOTIFY_CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_ARTIST_ID     = '0lt7yivQzmpsdcZ8wKuv2M';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    // Step 1: Get access token
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET
      })
    });
    const tokenText = await tokenRes.text();
    let tokenData;
    try { tokenData = JSON.parse(tokenText); } catch(e) { throw new Error('Token parse error: ' + tokenText.slice(0, 100)); }
    if (!tokenData.access_token) throw new Error('No access token: ' + JSON.stringify(tokenData));

    // Step 2: Get artist data
    const artistRes = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const artistText = await artistRes.text();
    let artistData;
    try { artistData = JSON.parse(artistText); } catch(e) { throw new Error('Artist parse error: ' + artistText.slice(0, 100)); }
    if (artistData.error) throw new Error('Artist error: ' + artistData.error.message);

    res.status(200).json({ followers: artistData.followers?.total ?? 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
