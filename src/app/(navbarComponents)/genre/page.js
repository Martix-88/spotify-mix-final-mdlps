'use client';

import { useState } from 'react';
import GenreWidget from '@/components/widgets/GenreWidget.jsx';

export default function GenrePage() {
    // Inicializar el estado para guardar los géneros seleccionados (lista de strings)
    const [selectedGenres, setSelectedGenres] = useState([]);

    // Función para manejar los cambios de selección que provienen del widget
    const handleGenreSelect = (newGenresList) => {
        console.log('Géneros seleccionados actualizados:', newGenresList);
        // Actualiza el estado principal con la nueva lista
        setSelectedGenres(newGenresList);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
                SELECCIÓN DE GÉNEROS
            </h1>

            {/* Renderizar el widget y pasar el estado y el manejador como props */}
            <GenreWidget
                onSelect={handleGenreSelect}
                selectedGenres={selectedGenres}
            />

            <div className="mt-8 p-4 bg-white rounded-xl shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                    Géneros elegidos:
                </h2>
                {selectedGenres.length === 0 ? (
                    <p className="text-gray-500">
                        Selecciona hasta 5 géneros arriba.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {selectedGenres.map((genre) => (
                            <span
                                key={genre}
                                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-lime-100 text-gray-900"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
