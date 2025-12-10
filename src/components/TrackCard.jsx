'use client';

import React, { useState, useEffect } from 'react';

// Límite de canciones a mostrar y de semillas para la recomendación
const TRACK_LIMIT = 10;
const MAX_SEEDS = 5;

// Función auxiliar para obtener nombres de artistas
const getArtistNames = (track) => {
    return (
        track.artists?.map((artist) => artist.name).join(', ') ||
        'Artista Desconocido'
    );
};

export default function TrackCard({
    market = 'ES',
    onTrackSelect,
    selectedTracks = [],
}) {
    const [savedTracks, setSavedTracks] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedTracks = async () => {
            setLoading(true);
            setError(null);

            // Obtener el token de acceso desde localStorage
            const accessToken = localStorage.getItem('spotify_token');

            if (!accessToken) {
                setError(
                    'Token de Spotify no encontrado. Por favor, inicia sesión.'
                );
                setLoading(false);
                return;
            }

            try {
                const url = `https://api.spotify.com/v1/me/tracks?limit=${TRACK_LIMIT}&market=${market}`;

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    throw new Error(
                        "Token expirado o inválido. (Asegúrate de tener el scope 'user-library-read' en la autenticación)"
                    );
                }
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(
                        data.error?.message ||
                            `Error al cargar las canciones: ${response.status}`
                    );
                }

                const data = await response.json();
                // Mapeamos los 'items' para extraer solo la pista (track)
                const tracksData = data.items
                    .map((item) => item.track)
                    .filter((track) => track !== null);
                setSavedTracks(tracksData);
            } catch (err) {
                console.error('Error fetching saved tracks:', err);
                const displayError =
                    err.name === 'TypeError' && !navigator.onLine
                        ? 'Error de red o conexión.'
                        : err.message || 'Error de conexión.';
                setError(displayError);
                setSavedTracks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedTracks();
    }, [market]);

    if (isLoading) {
        return (
            <div className="p-4 bg-gray-50 rounded-xl shadow border border-gray-200 lg:col-span-3">
                <p className="text-lg font-medium text-gray-500 text-center animate-pulse">
                    Cargando tu biblioteca...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 rounded-xl shadow border border-red-200 lg:col-span-3">
                <h3 className="text-xl font-bold mb-2 text-red-700">
                    Error de Carga
                </h3>
                <p className="text-sm text-red-500 mt-1">{error}</p>
            </div>
        );
    }

    if (savedTracks.length === 0) {
        return (
            <div className="p-4 bg-yellow-50 rounded-xl shadow border border-yellow-200 lg:col-span-3">
                <p className="text-md font-medium text-yellow-700 text-center">
                    Tu biblioteca está vacía o no se encontraron pistas.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-xl shadow-xl border border-gray-300">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 border-gray-200">
                📚 Selecciona tus canciones favoritas ({TRACK_LIMIT} más
                recientes)
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Haz click en una canción para añadirla como referencia (máx.{' '}
                {MAX_SEEDS}).
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {savedTracks.map((track) => {
                    const artistNames = getArtistNames(track);
                    const albumImage =
                        track.album?.images?.[2]?.url ||
                        'https://placehold.co/64x64/505050/FFFFFF?text=T';
                    const isSelected = selectedTracks.includes(track.id); // Comprobar si está seleccionada

                    return (
                        <div
                            key={track.id}
                            onClick={() => onTrackSelect(track.id)} // Llama al handler del padre
                            className={`flex items-center p-2 rounded-lg transition duration-150 border cursor-pointer 
                                ${
                                    isSelected
                                        ? 'bg-red-100 border-red-200 shadow-md transform scale-[1.01]'
                                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                }`}
                        >
                            <img
                                src={albumImage}
                                alt={track.album?.name}
                                className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 ml-3">
                                <p className="font-semibold text-gray-900 truncate">
                                    {track.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {artistNames}
                                </p>
                            </div>
                            <span
                                className={`text-sm ml-4 flex-shrink-0 ${
                                    isSelected
                                        ? 'text-gray-600 font-bold'
                                        : 'text-gray-400'
                                }`}
                            >
                                {isSelected ? 'SELECCIONADA' : 'AÑADIR'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
