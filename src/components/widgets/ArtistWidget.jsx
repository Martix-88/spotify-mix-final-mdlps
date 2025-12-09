// src/components/widgets/ArtistWidget.jsx
'use client';

import React from 'react';
import { useState, useEffect } from 'react';

export default function ArtistWidget({ onSelect, selectedArtists }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchArtists = async (search) => {
        if (!search || search.length < 2) {
            setResults([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Obtengo el token desde el localStorage
            const accessToken = localStorage.getItem('spotify_token');

            if (!accessToken) {
                setError(
                    'Token de acceso no encontrado. Por favor, inicia sesión.'
                );
                setLoading(false);
                return;
            }

            const encodedQuery = encodeURIComponent(search);

            // Endpoint confirmado para búsqueda de artistas: GET /search?type=artist
            const url = `https://api.spotify.com/v1/search?type=artist&q=${encodedQuery}&limit=7`; // Usamos el endpoint de búsqueda

            const response = await fetch(url, {
                headers: {
                    // El token es obligatorio
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                // Token expirado o inválido (debería manejarse con refresh, pero por ahora mostramos el error)
                throw new Error(
                    'Token de Spotify expirado o inválido. Debes refrescar la sesión.'
                );
            }
            if (!response.ok) {
                throw new Error(
                    `Error en la API de Spotify: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();

            // La respuesta de la API de búsqueda viene anidada en data.artists.items
            setResults(data.artists?.items || []);
        } catch (err) {
            console.error('Error al buscar el artista: ', err);
            setResults([]);
            setError(err.message || 'Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    // Efecto que se ejecuta CADA VEZ que el estado 'query' cambia.
    useEffect(() => {
        searchArtists(query);
    }, [query]);

    // Manejador para el input de texto
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Lógica para añadir/quitar un artista de la selección
    const handleSelect = (artist) => {
        const isSelected = selectedArtists.find(
            (item) => item.id === artist.id
        );
        let updatedItems;

        if (isSelected) {
            updatedItems = selectedArtists.filter(
                (item) => item.id !== artist.id
            );
        } else {
            if (selectedArtists.length >= 5) {
                alert('Máximo de 5 artistas alcanzado.');
                return;
            }
            updatedItems = [...selectedArtists, artist];
        }
        onSelect(updatedItems);
    };

    return (
        <div className="p-4 bg-[#ffb395] rounded-xl shadow-xl border border-red-100">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2 border-red-200">
                Selecciona tus artistas favoritos...
            </h3>

            <input
                type="text"
                placeholder="Escribe el nombre de un artista..."
                value={query}
                onChange={handleInputChange}
                className="w-full p-3 border border-red-300 rounded-lg focus:ring-red-400 focus:border-red-400 text-gray-800 bg-white placeholder-gray-500 transition duration-150"
            />

            {isLoading && (
                <p className="text-sm mt-3 text-gray-500 text-center">
                    Buscando artistas...
                </p>
            )}
            {error && (
                <p className="text-sm mt-3 text-gray-900 font-medium text-center">
                    {error}
                </p>
            )}

            <ul className="mt-4 max-h-56 overflow-y-auto space-y-2 pr-1">
                {/* Mensaje si no hay resultados */}
                {!isLoading &&
                    results.length === 0 &&
                    query.length >= 2 &&
                    !error && (
                        <li className="text-sm text-gray-500 p-2 text-center">
                            Oops! Parece que no hemos podido encontrar a "
                            {query}".
                        </li>
                    )}

                {/* Mapeo de resultados */}
                {results.map((artist) => {
                    const isSelected = selectedArtists.find(
                        (item) => item.id === artist.id
                    );
                    return (
                        <li
                            key={artist.id}
                            onClick={() => handleSelect(artist)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-150 ease-in-out border ${
                                isSelected
                                    ? 'bg-red-400 text-white shadow-md border-red-500'
                                    : 'bg-white hover:bg-red-100 text-gray-800 border-gray-100'
                            }`}
                        >
                            <img
                                src={
                                    artist.images?.[artist.images.length - 1]
                                        ?.url ||
                                    'https://placehold.co/40x40/333333/FFFFFF?text=A'
                                }
                                alt={artist.name}
                                className="w-10 h-10 rounded-full mr-4 object-cover shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                                <span
                                    className={`font-semibold truncate block ${
                                        isSelected
                                            ? 'text-white'
                                            : 'text-gray-800'
                                    }`}
                                >
                                    {artist.name}
                                </span>
                                <span
                                    className={`text-xs ${
                                        isSelected
                                            ? 'opacity-90'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {artist.popularity}% Popularidad
                                </span>
                            </div>
                            {isSelected && (
                                <span className="ml-auto text-lg">✅</span>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Chips de Seleccionados */}
            <div className="mt-4 pt-4 border-t border-red-200">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                    Selección ({selectedArtists.length}/5):
                </h4>
                <div className="flex flex-wrap gap-2">
                    {selectedArtists.length > 0 ? (
                        selectedArtists.map((item) => (
                            <span
                                key={item.id}
                                className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full bg-[#d26b61] text-white cursor-pointer hover:bg-[#8e4741] transition shadow-sm"
                                onClick={() => handleSelect(item)}
                            >
                                {item.name}
                                <span className="ml-2 font-bold text-white">
                                    ×
                                </span>
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-900">
                            Aún no has seleccionado artistas. ¡Busca arriba!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
