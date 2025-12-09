import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className="bg-[#ffa07a] py-4 px-6 shadow-md">
            <ul className="flex gap-4">
                <li className="bg-[#e16d63] py-2 px-5 rounded-full text-white font-semibold transition-colors duration-200 hover:bg-[#e06558]">
                    <Link href="/artist">Artista</Link>
                </li>
                <li className="bg-[#e16d63] py-2 px-5 rounded-full text-white font-semibold transition-colors duration-200 hover:bg-[#e06558]">
                    <Link href="/decade">Década</Link>
                </li>
                <li className="bg-[#e16d63] py-2 px-5 rounded-full text-white font-semibold transition-colors duration-200 hover:bg-[#e06558]">
                    <Link href="/genre">Género</Link>
                </li>
                <li className="bg-[#e16d63] py-2 px-5 rounded-full text-white font-semibold transition-colors duration-200 hover:bg-[#e06558]">
                    <Link href="/mood">Mood</Link>
                </li>
                <li className="bg-[#e16d63] py-2 px-5 rounded-full text-white font-semibold transition-colors duration-200 hover:bg-[#e06558]">
                    <Link href="/dashboard">Dashboard</Link>
                </li>
            </ul>
        </nav>
    );
}
