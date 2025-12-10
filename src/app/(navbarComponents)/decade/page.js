'use client'; // Importante para usar hooks de React

import { useState } from 'react';
import DecadeWidget from '@/components/widgets/DecadeWidget.jsx';

export default function DecadePage() {
    // Estado para guardar las décadas seleccionadas (ej: ['1980s', '1990s'])
    const [selectedDecades, setSelectedDecades] = useState([]);

    // Función que el DecadeWidget llama para actualizar el estado del padre
    const handleDecadeSelect = (newDecadesList) => {
        console.log('Décadas seleccionadas:', newDecadesList);
        setSelectedDecades(newDecadesList);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
                SELECCIÓN DE DÉCADAS MUSICALES
            </h1>

            {/* Paso el estado y la función de actualización al widget */}
            <DecadeWidget
                onSelect={handleDecadeSelect}
                selectedDecades={selectedDecades}
            />

            {/* Resumen de la selección en el componente padre */}
            <div className="mt-8 p-4 bg-white rounded-xl shadow border border-gray-200">
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                    Décadas elegidas:
                </h2>
                {selectedDecades.length === 0 ? (
                    <p className="text-gray-900">
                        Selecciona hasta 3 décadas arriba.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {selectedDecades.map((decade) => (
                            <span
                                key={decade}
                                className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-md bg-[#faafa8] text-gray-900"
                            >
                                {decade}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
