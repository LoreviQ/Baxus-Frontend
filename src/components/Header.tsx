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
                <h1 className="text-6xl font-bold text-white tracking-wider [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000]">
                    BAXATHON
                </h1>
            </div>
        </div>
    );
}

function TabBar() {
    return (
        <nav className="text-white flex w-full justify-between px-16 border-b border-white">
            <a
                href="https://oliver.tj"
                className="hover:text-yellow-700 flex items-center font-bold"
            >
                By Oliver Jay
            </a>
            <div className="flex w-full max-w-3xl mx-auto justify-between">
                <NavButton to="/whiskeygoggles" text="Whiskey Goggles" />
                <NavButton to="/bob" text="BOB" />
                <NavButton to="/honeybarrel" text="Honey Barrel" />
            </div>
            <a
                href="https://github.com/LoreviQ/Baxus-Frontend"
                className="hover:text-yellow-700 flex items-center font-bold"
            >
                GitHub Repository
            </a>
        </nav>
    );
}

function NavButton({ to, text }: { to: string; text?: string }) {
    return (
        <div className="flex">
            <NavLink
                to={to}
                className={({ isActive }) => `
                flex px-4 py-4 items-center justify-center min-w-40 rounded-t-lg 
                font-bold text-white border-white
                ${isActive ? 'border-l border-r border-t ' : ''} hover:border-l hover:border-r hover:border-t
            `}
            >
                {text}
            </NavLink>
        </div>
    );
}
