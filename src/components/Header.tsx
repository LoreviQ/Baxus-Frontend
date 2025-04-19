import { NavLink } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-black">
            <Hero />
            <TabBar />
        </header>
    );
}

function Hero() {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-yellow-300 via-yellow-700 via-30% to-black to-70%"></div>
            <div className="h-64 flex items-center justify-center relative z-10">
                <h1 className="text-6xl font-bold text-white tracking-wider [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                    BAXATHON
                </h1>
            </div>
            <div className="absolute bottom-0 w-full px-16 py-2 flex justify-between text-white font-bold text-xl z-10">
                <div>
                    <a href="https://oliver.tj" className="hover:text-yellow-700">
                        By Oliver Jay
                    </a>
                </div>
                <a
                    href="https://github.com/LoreviQ/Baxus-Frontend"
                    className="hover:text-yellow-700"
                >
                    GitHub Repository
                </a>
            </div>
        </div>
    );
}

function TabBar() {
    return (
        <nav className="text-white flex w-full max-w-3xl mx-auto justify-between">
            <NavLink
                to="/whiskeygoggles"
                className={({ isActive }) =>
                    `px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                }
            >
                Whiskey Goggles
            </NavLink>
            <NavLink
                to="/bob"
                className={({ isActive }) =>
                    `px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                }
            >
                Bob
            </NavLink>
            <NavLink
                to="/honeybarrel"
                className={({ isActive }) =>
                    `px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                }
            >
                Honey Barrel
            </NavLink>
        </nav>
    );
}
