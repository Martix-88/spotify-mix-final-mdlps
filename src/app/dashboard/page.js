'use client';

import { useState } from 'react';

// Importar Utilidades de autenticación
import { getAccessToken } from '@/lib/auth';

import {
    generatePlaylist,
    getUserProfileId,
    createPlaylist,
    addTracksToPlaylist,
} from '@/lib/spotify';

// Importar Widgets y Botones
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import TrackCard from '@/components/TrackCard';
import RefreshTokenButton from '@/components/RefreshTokenButton';
import PlayListDisplay from '@/components/PlayListDisplay';
import PopularityWidget from '@/components/widgets/PopularityWidget';

// *** DEFINICIÓN INICIAL DE ESTADOS ***
const initialMoods = {
    energy: 50,
    valence: 50,
    danceability: 50,
    acousticness: 50,
};
const initialSeedTrackIds = [];
const MAX_SEEDS = 5;

export default function () {
    // Filtros
    const [selectedDecades, setSelectedDecades] = useState([]);
    const [selectedMoods, setSelectedMoods] = useState(initialMoods);
    const [seedTrackIds, setSeedTrackIds] = useState(initialSeedTrackIds);

    // Estados necesarios para la búsqueda (aún sin widgets de entrada):
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [popularityRange, setPopularityRange] = useState([0, 100]);

    // Control y Salida
    const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // --- Handlers ---
    const handleDecadeSelect = (list) => setSelectedDecades(list);
    const handleMoodSelect = (moods) => setSelectedMoods(moods);
    const handlePopularitySelect = (range) => setPopularityRange(range);
    const handleArtistSelect = (artists) => setSelectedArtists(artists);
    const handleGenreSelect = (genres) => setSelectedGenres(genres);

    const handleTrackSeedsSelect = (trackId) => {
        let updatedSeeds;
        if (seedTrackIds.includes(trackId)) {
            updatedSeeds = seedTrackIds.filter((id) => id !== trackId);
        } else if (seedTrackIds.length < MAX_SEEDS) {
            updatedSeeds = [...seedTrackIds, trackId];
        } else {
            alert(`Máximo de ${MAX_SEEDS} pistas semilla alcanzado.`);
            return;
        }
        setSeedTrackIds(updatedSeeds);
    };

    // Handler local que llama a la función de búsqueda del utility.
    const handleGeneratePlaylist = async () => {
        setIsGenerating(true);
        setCurrentPlaylistId(null);

        if (!getAccessToken()) {
            alert('Por favor, renueva tu token o inicia sesión.');
            setIsGenerating(false);
            return;
        }

        const preferences = {
            artists: selectedArtists.map((artist) => artist.id),
            genres: selectedGenres,
            decades: selectedDecades,
            popularity: popularityRange,
            seedTrackIds: seedTrackIds,
            moods: selectedMoods,
        };

        try {
            // 1. OBTENER PISTAS FILTRADAS
            const tracks = await generatePlaylist(preferences);

            if (tracks.length === 0) {
                alert(
                    'No se encontraron canciones con los filtros seleccionados. Intenta cambiar tus preferencias.'
                );
                setIsGenerating(false);
                return;
            }

            console.log(`Pistas encontradas y filtradas: ${tracks.length}`);

            // Mapear pistas a URIs para la API de añadir pistas
            const trackUris = tracks.map((track) => track.uri);
            const playlistName = `Taste Mixer - ${new Date().toLocaleDateString(
                'es-ES'
            )}`;

            // OBTENER ID DEL USUARIO (GET /me)
            const userId = await getUserProfileId();
            if (!userId) throw new Error('Fallo al obtener ID de usuario.');

            // CREAR PLAYLIST VACÍA (POST /users/{user_id}/playlists)
            const playlistId = await createPlaylist(userId, playlistName);

            // AÑADIR PISTAS A LA PLAYLIST (POST /playlists/{playlist_id}/tracks)
            await addTracksToPlaylist(playlistId, trackUris);

            // Mostrar la playlist
            setCurrentPlaylistId(playlistId);

            alert(
                `¡Playlist "${playlistName}" creada con éxito en tu cuenta de Spotify con ${tracks.length} canciones!`
            );
        } catch (error) {
            console.error('Error en el flujo de generación:', error);
            if (error.message.includes('Scopes')) {
                alert(
                    `Error: ${error.message}. Asegúrate de haber iniciado sesión con los permisos necesarios (playlist-modify-public/private).`
                );
            } else {
                alert(`Error en el proceso de generación: ${error.message}`);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Lógica para deshabilitar el botón
    const hasSeeds =
        selectedArtists.length > 0 ||
        selectedGenres.length > 0 ||
        seedTrackIds.length > 0;
    const isGenerateButtonDisabled =
        (!hasSeeds && selectedDecades.length === 0) || isGenerating;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* ENCABEZADO Y BOTÓN DE RENOVACIÓN */}
            <div className="flex justify-between items-start mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Spotify Taste Mixer
                </h1>
                <RefreshTokenButton />
            </div>

            {/* SECCIÓN DE ENTRADA / FILTRO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {/* Widget de Décadas */}
                <DecadeWidget
                    onSelect={handleDecadeSelect}
                    selectedDecades={selectedDecades}
                />

                {/* Widget de Mood/Audio Features */}
                <MoodWidget
                    onSelect={handleMoodSelect}
                    selectedMoods={selectedMoods}
                />

                {/* Popularity Widget */}
                <PopularityWidget
                    onSelect={handlePopularitySelect}
                    selectedRange={popularityRange}
                />

                {/* Artist Widget */}
                <ArtistWidget
                    onSelect={handleArtistSelect}
                    selectedArtists={selectedArtists}
                />

                {/* Genre Widget */}
                <GenreWidget
                    onSelect={handleGenreSelect}
                    selectedGenres={selectedGenres}
                />

                {/* Widget de Canciones Guardadas (TrackCard) */}
                <div className="lg:col-span-3">
                    <TrackCard
                        market="ES"
                        onTrackSelect={handleTrackSeedsSelect}
                        selectedTracks={seedTrackIds}
                    />
                </div>
            </div>

            {/* 2. BOTÓN DE GENERACIÓN */}
            <div className="text-center my-8">
                <button
                    onClick={handleGeneratePlaylist}
                    className="px-10 py-4 bg-red-300 text-white text-xl font-bold rounded-full shadow-lg hover:bg-red-400 transition duration-200 disabled:opacity-50"
                    disabled={isGenerateButtonDisabled}
                >
                    {isGenerating
                        ? 'Buscando Pistas...'
                        : 'Generar Playlist Única'}
                </button>
            </div>

            <div className="mt-12">
                <PlayListDisplay playlistId={currentPlaylistId} market="ES" />
            </div>
        </div>
    );
}
