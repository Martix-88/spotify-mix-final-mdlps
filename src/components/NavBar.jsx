import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className="bg-[#324373] py-6 px-6">
            <ul className="flex gap-4 text-white">
                <li className="bg-[#203164] py-3 px-5 rounded-xl hover:bg-[#394F8F]">
                    <Link href="/artist">Artista</Link>
                </li>
                <li className="bg-[#203164] py-3 px-5 rounded-xl hover:bg-[#394F8F]">
                    <Link href="/decade">Década</Link>
                </li>
                <li className="bg-[#203164] py-3 px-5 rounded-xl hover:bg-[#394F8F]">
                    <Link href="/genre">Género</Link>
                </li>
                <li className="bg-[#203164] py-3 px-5 rounded-xl hover:bg-[#394F8F]">
                    <Link href="/mood">Mood</Link>
                </li>
                <li className="bg-[#203164] py-3 px-5 rounded-xl hover:bg-[#394F8F]">
                    <Link href="/dashboard">Dashboard</Link>
                </li>
            </ul>
        </nav>
    );
}
