'use client';

import { useState, useEffect } from 'react';

export default function PopularityWidget({
    onSelect,
    selectedRange = [0, 100],
}) {
    // Usamos un estado interno para el slider antes de emitir el cambio al padre
    const [range, setRange] = useState(selectedRange);

    useEffect(() => {
        // Inicializa el estado interno con el prop
        setRange(selectedRange);
    }, [selectedRange]);

    // Función para manejar el cambio en el input range (slider)
    const handleChange = (e) => {
        const value = parseInt(e.target.value);
        // Mantenemos el rango [0, value] por simplicidad, aunque el README sugiere [min, max].
        // Si quieres un rango doble, necesitarías dos sliders o un componente de rango más complejo.
        setRange([0, value]);

        // Llamar a la función del padre inmediatamente
        onSelect([0, value]);
    };

    // Función que devuelve una etiqueta basada en el valor actual de popularidad
    const getCategory = (maxVal) => {
        if (maxVal >= 80) return 'Mainstream Hits (80-100)';
        if (maxVal >= 50) return 'Popular (50-80)';
        if (maxVal > 0) return 'Underground / Joyas Ocultas (0-50)';
        return 'Todos (0-100)';
    };

    const currentMax = range[1];

    return (
        <div className="p-4 bg-[#ffb395] rounded-xl shadow-lg border border-red-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                Popularidad de Pistas
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Filtra por la popularidad de las canciones en Spotify.
            </p>

            <div className="mb-4">
                <label className="block text-lg font-bold text-gray-800">
                    Popularidad Máxima: *{currentMax}*
                </label>
                <p className="text-sm text-gray-900 font-semibold mt-1">
                    {getCategory(currentMax)}
                </p>
            </div>

            <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={currentMax}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-gray-600 [&::-moz-range-thumb]:bg-gray-600"
            />

            <div className="flex justify-between text-xs mt-2 text-gray-800">
                <span>0 (Underground)</span>
                <span>100 (Mainstream)</span>
            </div>
        </div>
    );
}
