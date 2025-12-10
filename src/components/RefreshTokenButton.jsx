'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { refreshAccessToken } from '@/lib/auth';

export default function RefreshTokenButton() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', 'idle'

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setStatus('idle');

        const success = await refreshAccessToken();

        if (success) {
            setStatus('success');
            // Recargar la página para que los widgets reintenten sus peticiones
            router.refresh();
            setTimeout(() => setStatus(null), 3000);
        } else {
            setStatus('error');
            setTimeout(() => {
                setStatus(null);
                // Si el refresh falla, redirijo al inicio para que el usuario se logee de nuevo
                router.push('/');
            }, 5000);
        }

        setIsRefreshing(false);
    };

    const buttonText = isRefreshing
        ? 'Renovando...'
        : status === 'success'
        ? '¡Sesión Renovada!'
        : 'Renovar Sesión (Manual)';

    const buttonClass = `
        px-4 py-2 text-sm font-semibold rounded-full shadow-lg transition duration-200 
        ${
            isRefreshing
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : status === 'success'
                ? 'bg-green-500 text-white'
                : status === 'error'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-400 text-white hover:bg-red-300'
        }
    `;

    return (
        <div className="text-right flex flex-col items-end">
            <button
                onClick={handleRefresh}
                disabled={isRefreshing || status === 'success'}
                className={buttonClass}
            >
                {buttonText}
            </button>
            {status === 'error' && (
                <p className="text-xs text-red-500 mt-1">
                    Error. Token inválido. Redirigiendo a login...
                </p>
            )}
        </div>
    );
}
