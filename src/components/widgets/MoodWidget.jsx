'use client';

import React from 'react';
import { useState } from 'react';

// Valores iniciales para el mood
const initialMoods = {
    energy: 50,
    valence: 50,
    danceability: 50,
    acousticness: 50,
};

// Array para facilitar el mapeo de los sliders
const PARAMETERS = [
    {
        key: 'energy',
        label: 'Energía',
        description: 'Intensidad y actividad (0=Calma, 100=Frenético).',
    },
    {
        key: 'valence',
        label: 'Felicidad / Positividad',
        description: 'Positividad musical (0=Triste, 100=Alegre).',
    },
    {
        key: 'danceability',
        label: 'Bailabilidad',
        description:
            'Qué tan adecuada es una canción para bailar (0=Baja, 100=Alta).',
    },
    {
        key: 'acousticness',
        label: 'Acústico',
        description:
            'Qué tan acústica es una canción (0=Electrónica, 100=Acústica).',
    },
];

export default function MoodWidget({ onSelect, selectedMoods = initialMoods }) {
    // Función para manejar el cambio en los sliders
    const handleSliderChange = (key, value) => {
        // Asegurarse de que el valor es un número
        const newMoods = { ...selectedMoods, [key]: Number(value) };
        onSelect(newMoods);
    };

    return (
        <div className="p-4 bg-[#ffb395] rounded-xl shadow-xl border border-red-100">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                Moods y Características de Audio
            </h3>

            {/* 2. SLIDERS PARA CONTROL FINO*/}
            <div className="mt-4 pt-4 border-t space-y-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Ajuste de Parámetros (0-100):
                </h4>

                {PARAMETERS.map(({ key, label, description }) => (
                    <div key={key}>
                        <label
                            htmlFor={key}
                            className="block text-sm font-bold text-white capitalize mb-1"
                        >
                            {label} ({selectedMoods[key]})
                        </label>
                        <p className="text-xs text-gray-900 mb-2">
                            {description}
                        </p>

                        <input
                            type="range"
                            id={key}
                            min="0"
                            max="100"
                            step="1"
                            value={selectedMoods[key]}
                            onChange={(e) =>
                                handleSliderChange(key, e.target.value)
                            }
                            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer range-lg transition duration-150 ease-in-out"
                            style={{
                                // Estilo inline para simular la barra de progreso usando un gradiente
                                background: `linear-gradient(to right, #6E4035 0%, #4F2E26 ${selectedMoods[key]}%, #FFFFFF ${selectedMoods[key]}%, #FFFFFF 100%)`,
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
