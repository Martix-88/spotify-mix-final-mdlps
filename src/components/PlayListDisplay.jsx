// src/components/widgets/PlayListDisplay.jsx
'use client';

import React, { useState, useEffect } from 'react';

export default function PlayListDisplay({ playlistId, market = 'ES' }) {
    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect se ejecuta cada vez que playlistId cambia
    useEffect(() => {
        if (!playlistId) {
            setPlaylist(null); // Limpiar playlist si no hay ID
            return;
        }

        const fetchPlaylist = async () => {
            setLoading(true);
            setError(null);

            // 🔑 Obtener el token de acceso desde localStorage
            const accessToken = localStorage.getItem('spotify_token');

            if (!accessToken) {
                setError(
                    'Token de Spotify no encontrado. Por favor, inicia sesión.'
                );
                setLoading(false);
                return;
            }

            try {
                // Endpoint para obtener la información detallada de la playlist
                // Usando el endpoint proporcionado: /playlists/{playlist_id}
                const url = `https://api.spotify.com/v1/playlists/${playlistId}?market=${market}`;

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    throw new Error(
                        'Token expirado o inválido. Debes refrescar la sesión.'
                    );
                }
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(
                        data.error?.message ||
                            `Error al cargar la playlist: ${response.status}`
                    );
                }

                const data = await response.json();
                setPlaylist(data);
            } catch (err) {
                console.error('Error fetching playlist:', err);
                setError(
                    err.message || 'Error de conexión al cargar la playlist.'
                );
                setPlaylist(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId, market]);

    // Manejo de estados de carga, error y playlistId no proporcionado

    if (!playlistId) {
        return (
            <div className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
                <p className="text-xl font-medium text-gray-500 text-center">
                    Esperando la generación de una playlist...
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 rounded-xl shadow border border-gray-200">
                <p className="text-xl font-medium text-red-300 text-center animate-pulse">
                    Cargando playlist...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-xl shadow border border-red-200">
                <p className="text-lg font-medium text-red-600">
                    Error al cargar la playlist:
                </p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
            </div>
        );
    }

    if (!playlist) {
        // Esto solo debería ocurrir si el fetch falla sin un error explícito
        return null;
    }

    // --- Funciones Auxiliares para Renderizado ---
    const playlistImage =
        playlist.images?.[0]?.url ||
        'https://placehold.co/300x300/1DB954/FFFFFF?text=Spotify+Playlist';

    const getArtistNames = (track) => {
        return (
            track.artists?.map((artist) => artist.name).join(', ') ||
            'Artista Desconocido'
        );
    };

    // Función para formatear duración de ms a min:seg
    const formatDuration = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // --- Renderizado de la Playlist ---
    return (
        <div className="p-6 bg-white rounded-xl shadow-2xl border border-red-400">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6 pb-6 border-b border-green-100">
                <img
                    src={playlistImage}
                    alt={`Portada de ${playlist.name}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-lg flex-shrink-0"
                />
                <div>
                    <span className="text-sm font-medium text-green-600 uppercase">
                        Playlist Generada
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
                        {playlist.name}
                    </h2>

                    {playlist.description &&
                        playlist.description !== 'string' && (
                            <p
                                className="text-gray-600 mt-2 text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: playlist.description,
                                }}
                            />
                        )}
                    <a
                        href={playlist.external_urls?.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-green-700 font-semibold hover:text-green-500 transition duration-150"
                    >
                        Abrir en Spotify
                    </a>
                </div>
            </div>

            {/* Lista de Canciones */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                Canciones ({playlist.tracks?.total || 0})
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {playlist.tracks?.items?.length > 0 ? (
                    playlist.tracks.items.map((item, index) => {
                        const track = item.track;
                        if (!track || track.type !== 'track') return null; // Ignorar si no es una pista

                        const artistNames = getArtistNames(track);

                        return (
                            <div
                                key={track.id || index}
                                className="flex items-center p-3 bg-gray-50 rounded-lg transition duration-150 border border-gray-100"
                            >
                                <span className="text-sm font-medium text-gray-500 w-6 text-right mr-3">
                                    {index + 1}.
                                </span>
                                <img
                                    src={
                                        track.album?.images?.[2]?.url ||
                                        'https://placehold.co/40x40/333333/FFFFFF?text=T'
                                    }
                                    alt={track.album?.name}
                                    className="w-10 h-10 object-cover rounded mr-4 shadow-sm flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {track.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {artistNames} — {track.album?.name}
                                    </p>
                                </div>
                                <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                                    {formatDuration(track.duration_ms)}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 p-4">
                        La playlist no contiene canciones.
                    </p>
                )}
            </div>
        </div>
    );
}
