const SPOTIFY_CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID     || '9c55ecb947c844de936e824d1116703b';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'eb2006720aec41c3ad53504a7378f8c9';
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
    if (!tokenData.access_token) throw new Error('Token error: ' + JSON.stringify(tokenData));
    const headers = { Authorization: `Bearer ${tokenData.access_token}` };

    const albumsRes = await fetch(
      `https://api.spotify.com/v1/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single,ep&market=US&limit=50`,
      { headers }
    );
    const albumsData = await albumsRes.json();

    const releases = await Promise.all(
      (albumsData.items || []).map(async (album) => {
        const tracksRes = await fetch(
          `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=50`, { headers }
        );
        const tracksData = await tracksRes.json();
        return {
          id: album.id,
          name: album.name,
          type: album.album_type,
          releaseDate: album.release_date,
          image: album.images?.[0]?.url || null,
          url: album.external_urls?.spotify,
          totalTracks: album.total_tracks,
          tracks: (tracksData.items || []).map(t => ({
            num: t.track_number,
            name: t.name,
            url: t.external_urls?.spotify,
            duration: t.duration_ms
          }))
        };
      })
    );

    releases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    res.status(200).json({ releases });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
