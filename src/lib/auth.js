// Generar string aleatorio para el parámetro 'state'
export function generateRandomString(length) {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Construir URL de autorización de Spotify
export function getSpotifyAuthUrl() {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
    const state = generateRandomString(16);

    // Guardar el state para validación posterior (prevenir CSRF)
    if (typeof window !== 'undefined') {
        localStorage.setItem('spotify_auth_state', state);
    }

    const scope = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'playlist-modify-public',
        'playlist-modify-private',
    ].join(' ');

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        state: state,
        scope: scope,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Guardar tokens en localStorage
export function saveTokens(accessToken, refreshToken, expiresIn) {
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem('spotify_token', accessToken);
    localStorage.setItem('spotify_refresh_token', refreshToken);
    localStorage.setItem('spotify_token_expiration', expirationTime.toString());
}

// Obtener token actual (con verificación de expiración)
export function getAccessToken() {
    const token = localStorage.getItem('spotify_token');
    const expiration = localStorage.getItem('spotify_token_expiration');

    if (!token || !expiration) return null;

    // Si el token expiró, retornar null
    if (Date.now() > parseInt(expiration)) {
        return null;
    }

    return token;
}

// Verificar si hay token válido
export function isAuthenticated() {
    return getAccessToken() !== null;
}

// Cerrar sesión
export function logout() {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiration');
}

// Refrescar el token de acceso usando el refresh token
export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');

    if (!refreshToken) {
        console.error('No refresh token found. User must log in again.');
        return false;
    }

    try {
        // Llama a la API Route que tienes definida en /api/refresh-token/route.js
        const response = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                'Refresh token failed:',
                errorData.error || response.statusText
            );
            // Si el refresh token falla (ej. expiró o fue revocado), limpiamos todo
            logout();
            return false;
        }

        const data = await response.json();

        // Usar la función saveTokens ya definida en este archivo
        saveTokens(data.access_token, refreshToken, data.expires_in);

        console.log('Token successfully refreshed.');
        return true;
    } catch (error) {
        console.error('Error during token refresh:', error);
        return false;
    }
}
