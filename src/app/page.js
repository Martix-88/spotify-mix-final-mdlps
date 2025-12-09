'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Si ya está autenticado, redirigir al dashboard
        if (isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleLogin = () => {
        window.location.href = getSpotifyAuthUrl();
    };

    return (
        <>
            <div className="text-center text-5xl font-bold py-10">
                <span className="text-[#333333]">Spotify</span>
                &nbsp;
                <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#e16d63]">
                    <span className="relative text-white">
                        &nbsp;taste&nbsp;
                    </span>
                </span>
                {/* Mixer: Aplicamos el color oscuro (text-[#333333]) */}
                &nbsp;<span className="text-[#333333]">Mixer</span>
            </div>

            {/* Botón de Login */}
            <div className="text-center">
                <button
                    onClick={handleLogin}
                    className="bg-[#ff6f61] text-white py-3 px-7 rounded-full transition-colors duration-200 hover:bg-[#e06558] cursor-pointer font-semibold"
                >
                    LOGIN
                </button>
            </div>
        </>
    );
}
