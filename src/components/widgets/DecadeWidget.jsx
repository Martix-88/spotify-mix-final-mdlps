'use client';

import React from 'react';

const DECADES = [
    '1950s',
    '1960s',
    '1970s',
    '1980s',
    '1990s',
    '2000s',
    '2010s',
    '2020s',
];

const SELECTION_LIMIT = 3;

export default function DecadeWidget({ onSelect, selectedDecades }) {
    const handleSelectDecade = (decade) => {
        const isSelected = selectedDecades.includes(decade);
        let updatedList;

        if (isSelected) {
            // Quitar la década de la lista
            updatedList = selectedDecades.filter((item) => item !== decade);
        } else {
            // Añadir la década, comprobando el límite
            if (selectedDecades.length >= SELECTION_LIMIT) {
                alert(`Máximo de ${SELECTION_LIMIT} décadas alcanzado.`);
                return;
            }
            updatedList = [...selectedDecades, decade];
        }

        // Llamar a la función del componente padre
        onSelect(updatedList);
    };

    return (
        <div className="p-4 bg-[#faafa8] rounded-xl shadow-xl border border-red-100">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2 border-gray-200">
                Selecciona Tus Décadas Favoritas
            </h3>

            {/* 1. SELECCIÓN DE DÉCADAS */}
            <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                    Décadas disponibles (Máx. {SELECTION_LIMIT}):
                </h4>
                <div className="flex flex-wrap gap-2">
                    {DECADES.map((decade) => {
                        const isSelected = selectedDecades.includes(decade);

                        return (
                            <button
                                key={decade}
                                onClick={() => handleSelectDecade(decade)}
                                className={`px-4 py-2 rounded-full font-semibold transition duration-150 ease-in-out shadow-sm 
                                    ${
                                        isSelected
                                            ? 'bg-[#ae716a] text-white hover:bg-[#c7837b]'
                                            : 'bg-[#ae716a] text-white border border-red-300 hover:bg-red-100'
                                    }`}
                            >
                                {decade}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. RESUMEN DE SELECCIÓN */}
            <div className="mt-4 pt-4 border-t border-gray-900">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                    Décadas Seleccionadas ({selectedDecades.length}/
                    {SELECTION_LIMIT}):
                </h4>
                <div className="flex flex-wrap gap-2">
                    {selectedDecades.length === 0 ? (
                        <p className="text-sm text-gray-900">
                            Selecciona hasta {SELECTION_LIMIT} décadas.
                        </p>
                    ) : (
                        selectedDecades.map((decade) => (
                            <span
                                key={decade}
                                className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full bg-[#bc736a] text-white shadow-sm"
                            >
                                {decade}
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
