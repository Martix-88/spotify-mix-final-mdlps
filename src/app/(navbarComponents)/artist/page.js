// src/app/(navbarComponents)/artist/page.js o donde se encuentre ArtistPage.js
'use client'; // 👈 Asegúrate de que esta página es un componente cliente

import { useState } from 'react';
import ArtistWidget from '@/components/widgets/ArtistWidget.jsx';

export default function ArtistPage() {
    const [selectedArtists, setSelectedArtists] = useState([]);

    const handleArtistSelect = (newArtistsList) => {
        console.log('Artistas seleccionados:', newArtistsList);
        setSelectedArtists(newArtistsList);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
                SELECCIÓN DE ARTISTAS
            </h1>

            <ArtistWidget
                onSelect={handleArtistSelect}
                selectedArtists={selectedArtists}
            />

            <div className="mt-8 p-4 bg-white rounded-xl shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                    Artistas seleccionados para la Playlist:
                </h2>
                {selectedArtists.length === 0 ? (
                    <p className="text-gray-500">
                        Oops! Parece que tus artistas han escapado
                    </p>
                ) : (
                    <ul className="list-disc list-inside space-y-1">
                        {selectedArtists.map((artist) => (
                            <li key={artist.id} className="text-gray-700">
                                {artist.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
