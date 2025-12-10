'use client';

import React from 'react';
import { useState } from 'react';

const GENRES = [
    'acoustic',
    'afrobeat',
    'alt-rock',
    'alternative',
    'ambient',
    'anime',
    'black-metal',
    'bluegrass',
    'blues',
    'bossanova',
    'brazil',
    'breakbeat',
    'british',
    'cantopop',
    'chicago-house',
    'children',
    'chill',
    'classical',
    'club',
    'comedy',
    'country',
    'dance',
    'dancehall',
    'death-metal',
    'deep-house',
    'detroit-techno',
    'disco',
    'disney',
    'drum-and-bass',
    'dub',
    'dubstep',
    'edm',
    'electro',
    'electronic',
    'emo',
    'folk',
    'forro',
    'french',
    'funk',
    'garage',
    'german',
    'gospel',
    'goth',
    'grindcore',
    'groove',
    'grunge',
    'guitar',
    'happy',
    'hard-rock',
    'hardcore',
    'hardstyle',
    'heavy-metal',
    'hip-hop',
    'house',
    'idm',
    'indian',
    'indie',
    'indie-pop',
    'industrial',
    'iranian',
    'j-dance',
    'j-idol',
    'j-pop',
    'j-rock',
    'jazz',
    'k-pop',
    'kids',
    'latin',
    'latino',
    'malay',
    'mandopop',
    'metal',
    'metal-misc',
    'metalcore',
    'minimal-techno',
    'movies',
    'mpb',
    'new-age',
    'new-release',
    'opera',
    'pagode',
    'party',
    'philippines-opm',
    'piano',
    'pop',
    'pop-film',
    'post-dubstep',
    'power-pop',
    'progressive-house',
    'psych-rock',
    'punk',
    'punk-rock',
    'r-n-b',
    'rainy-day',
    'reggae',
    'reggaeton',
    'road-trip',
    'rock',
    'rock-n-roll',
    'rockabilly',
    'romance',
    'sad',
    'salsa',
    'samba',
    'sertanejo',
    'show-tunes',
    'singer-songwriter',
    'ska',
    'sleep',
    'songwriter',
    'soul',
    'soundtracks',
    'spanish',
    'study',
    'summer',
    'swedish',
    'synth-pop',
    'tango',
    'techno',
    'trance',
    'trip-hop',
    'turkish',
    'work-out',
    'world-music',
];

// lIMITE SUGGERIDO POR EL README
const SELECTION_LIMIT = 5;

export default function GenreWidget({ onSelect, selectedGenres }) {
    const [query, setQuery] = useState('');

    // Lógica para añadir/quitar un género de la selección
    const handleSelect = (genre) => {
        const isSelected = selectedGenres.includes(genre);
        let updatedList;

        if (isSelected) {
            updatedList = selectedGenres.filter((item) => item !== genre);
        } else {
            if (selectedGenres.length >= SELECTION_LIMIT) {
                alert(`Máximo de ${SELECTION_LIMIT} géneros alcanzado.`);
                return;
            }
            updatedList = [...selectedGenres, genre];
        }

        onSelect(updatedList);
    };

    // Lógica de filtrado
    let filteredGenres = GENRES;

    if (query) {
        const lowerCaseQuery = query.toLowerCase();
        filteredGenres = GENRES.filter((genre) =>
            genre.toLowerCase().includes(lowerCaseQuery)
        );
    }

    return (
        <div className="p-4 bg-[#ffb395] rounded-xl shadow-xl border border-[#ffb395]">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2 border-gray-900">
                Selecciona tus géneros favoritos
            </h3>

            {/* Input de Búsqueda para filtrar */}
            <input
                type="text"
                placeholder="Filtrar por nombre de género..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border border-[#e16d63] rounded-lg focus:ring-[#e16d63] focus:border-[#e16d63] text-gray-800 bg-white placeholder-gray-500 transition duration-150"
            />

            {/* Chips de Seleccionados */}
            <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                    Selección:
                </h4>
                <div className="flex flex-wrap gap-2">
                    {selectedGenres.length > 0 ? (
                        selectedGenres.map((genre) => (
                            <span
                                key={genre}
                                className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full bg-[#e16d63] text-white cursor-pointer hover:bg-[#c26057] transition shadow-sm"
                                onClick={() => handleSelect(genre)}
                            >
                                {genre}
                                <span className="ml-2 font-bold text-white">
                                    ×
                                </span>
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-gray-900">
                            Oops! Parece que aún no has seleccionado ningún
                            género. ¡Adelante!
                        </p>
                    )}
                </div>
            </div>

            {/* Lista de Resultados Filtrados */}
            <div className="mt-4 pt-4 border-t border-gray-900">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                    Géneros disponibles:
                </h4>
                <ul className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {/* Mensaje si no hay resultados de búsqueda */}
                    {filteredGenres.length === 0 && (
                        <li className="text-sm text-gray-900 p-2 text-center">
                            ¡Vaya! Parece que no hemos podido encontrar el
                            género que buscas
                        </li>
                    )}

                    {/* Mapeo de géneros filtrados */}
                    {filteredGenres.map((genre) => {
                        const isSelected = selectedGenres.includes(genre);
                        return (
                            <li
                                key={genre}
                                onClick={() => handleSelect(genre)}
                                className={`p-2 rounded-lg cursor-pointer capitalize transition duration-150 ease-in-out border ${
                                    isSelected
                                        ? 'bg-[#e16d63] text-white shadow-md border-[#e8948c] font-semibold' // Estilo seleccionado
                                        : 'bg-white hover:bg-[#e8948c] text-gray-800 border-gray-100' // Estilo normal
                                }`}
                            >
                                {genre}
                                {isSelected && (
                                    <span className="float-right text-lg">
                                        ✅
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
