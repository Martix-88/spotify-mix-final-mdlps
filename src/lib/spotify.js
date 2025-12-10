import { getAccessToken } from '@/lib/auth';

export async function generatePlaylist(preferences) {
    const { artists, genres, decades, popularity } = preferences;
    const token = getAccessToken();
    let allTracks = [];

    // 1. Obtener top tracks de artistas seleccionados
    for (const artist of artists) {
        const tracks = await fetch(
            `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=ES`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await tracks.json();
        allTracks.push(...data.tracks);
    }

    // 2. Buscar por géneros
    for (const genre of genres) {
        const results = await fetch(
            `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await results.json();
        allTracks.push(...data.tracks.items);
    }

    // 3. Filtrar por década
    if (decades.length > 0) {
        allTracks = allTracks.filter((track) => {
            const year = new Date(track.album.release_date).getFullYear();
            return decades.some((decade) => {
                const decadeStart = parseInt(decade);
                return year >= decadeStart && year < decadeStart + 10;
            });
        });
    }

    // 4. Filtrar por popularidad
    if (popularity) {
        const [min, max] = popularity;
        allTracks = allTracks.filter(
            (track) => track.popularity >= min && track.popularity <= max
        );
    }

    // 5. Eliminar duplicados y limitar a 30 canciones
    const uniqueTracks = Array.from(
        new Map(allTracks.map((track) => [track.id, track])).values()
    ).slice(0, 30);

    return uniqueTracks;
}

// NUEVAS FUNCIONES PARA LA GESTIÓN DE LA PLAYLIST
/**
 * Obtiene el ID del usuario de Spotify.
 */
export async function getUserProfileId() {
    const token = getAccessToken();
    if (!token) throw new Error('Token de acceso no disponible.');

    // Endpoint: GET /me
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(
            `Fallo al obtener el perfil de usuario: ${response.status}`
        );
    }

    const data = await response.json();
    return data.id;
}

/**
 * Crea una nueva playlist vacía para el usuario.
 */
export async function createPlaylist(userId, name) {
    const token = getAccessToken();
    if (!token) throw new Error('Token de acceso no disponible.');

    // Endpoint: POST /users/{user_id}/playlists
    const response = await fetch(
        `https://api.spotify.com/v1/artists//users/${userId}/playlists`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                description: 'Playlist generada por Spotify Taste Mixer.',
                public: true, // O false si solo queremos playlists privadas
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Fallo al crear la playlist: ${response.status}. ¿Scopes correctos?`
        );
    }

    const data = await response.json();
    return data.id;
}

/**
 * Añade una lista de pistas a una playlist existente.
 */
export async function addTracksToPlaylist(playlistId, trackUris) {
    const token = getAccessToken();
    if (!token) throw new Error('Token de acceso no disponible.');

    // Endpoint: POST /playlists/{playlist_id}/tracks
    const response = await fetch(
        `https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/playlists/${playlistId}/tracks`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: trackUris,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Fallo al añadir pistas a la playlist: ${response.status}`
        );
    }
    return response.json();
}
