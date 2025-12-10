import { getAccessToken } from '@/lib/auth';

export async function generatePlaylist(preferences) {
    const { artists, genres, decades, popularity } = preferences;
    const token = getAccessToken();
    let allTracks = [];

    // Verificación de token, crucial para que las llamadas funcionen
    if (!token) {
        console.error('Token de acceso no disponible.');
        return [];
    }

    // 1. Obtener top tracks de artistas seleccionados
    for (const artist of artists) {
        try {
            const response = await fetch(
                `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=ES`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) {
                console.error(
                    `Error (${response.status}) al buscar Top Tracks para el artista ${artist.id}.`
                );
                continue; // Saltar al siguiente artista
            }

            const data = await response.json();

            allTracks.push(...(data.tracks || []));
        } catch (error) {
            console.error(
                `Fallo inesperado al buscar top tracks para ${artist.id}:`,
                error
            );
        }
    }

    // 2. Buscar por géneros
    for (const genre of genres) {
        try {
            const response = await fetch(
                `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) {
                console.error(
                    `Error (${response.status}) al buscar tracks por género ${genre}.`
                );
                continue; // Saltar al siguiente género
            }

            const data = await response.json();

            allTracks.push(...(data?.tracks?.items || []));
        } catch (error) {
            console.error(
                `Fallo inesperado al buscar por género ${genre}:`,
                error
            );
        }
    }

    // 3. Filtrar por década
    if (decades.length > 0) {
        allTracks = allTracks.filter((track) => {
            // Verificación de nulidad en el objeto track
            if (!track || !track.album || !track.album.release_date)
                return false;

            const year = new Date(track.album.release_date).getFullYear();
            return decades.some((decade) => {
                const decadeStart = parseInt(decade, 10);
                return year >= decadeStart && year < decadeStart + 10;
            });
        });
    }

    // 4. Filtrar por popularidad
    if (popularity) {
        const [min, max] = popularity;
        allTracks = allTracks.filter(
            // Verificación de nulidad en track.popularity
            (track) =>
                track &&
                track.popularity != null &&
                track.popularity >= min &&
                track.popularity <= max
        );
    }

    // 5. Eliminar duplicados y limitar a 30 canciones (Tu lógica original)
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
