// src/app/(ruta_ejemplo)/mood/page.js
'use client';

import { useState } from 'react';
import MoodWidget from '@/components/widgets/MoodWidget.jsx';

// El estado inicial del padre debe coincidir con el del widget (50 en todos)
const initialMoods = {
    energy: 50,
    valence: 50,
    danceability: 50,
    acousticness: 50,
};

export default function MoodPage() {
    // Estado para guardar el objeto de los parámetros
    const [selectedMoods, setSelectedMoods] = useState(initialMoods);

    // Función que el MoodWidget llama para actualizar el estado del padre
    const handleMoodSelect = (newMoods) => {
        setSelectedMoods(newMoods);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
                AJUSTE DE MOOD
            </h1>

            {/* 1. Pasar el estado y la función de actualización al widget */}
            <MoodWidget
                onSelect={handleMoodSelect}
                selectedMoods={selectedMoods}
            />
        </div>
    );
}
