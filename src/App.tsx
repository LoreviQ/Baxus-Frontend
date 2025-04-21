import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import WhiskeyGoggles from './pages/WhiskeyGoggles';
import Bob from './pages/Bob';
import HoneyBarrel from './pages/HoneyBarrel';

function App() {
    const location = useLocation();
    const [currentBg, setCurrentBg] = useState(''); // The background image currently displayed

    useEffect(() => {
        let isMounted = true; // Flag to track if the effect cleanup has run

        // Determine image set based on route
        const isWhiskeyGoggles = location.pathname === '/whiskeygoggles';
        const lowRes = isWhiskeyGoggles ? '/bob-WG-low.webp' : '/bob-low.webp';
        const medRes = isWhiskeyGoggles ? '/bob-WG.webp' : '/bob.webp';
        const highRes = isWhiskeyGoggles ? '/bob-WG-high.webp' : '/bob-high.webp';

        // 1. Set low-res immediately
        setCurrentBg(lowRes);

        // Create image objects outside handlers for cleanup access
        const medImg = new Image();
        const highImg = new Image();

        // 2. Load medium-res
        medImg.onload = () => {
            if (!isMounted) return; // Don't update if effect re-ran or component unmounted
            setCurrentBg(medRes);

            // 3. Load high-res *after* medium has loaded and been set
            highImg.src = highRes;
            highImg.onload = () => {
                if (!isMounted) return; // Don't update if effect re-ran or component unmounted
                setCurrentBg(highRes);
            };
            highImg.onerror = () => {
                if (isMounted) console.error('Failed to load high-res image:', highRes);
            };
        };
        medImg.onerror = () => {
            if (isMounted) console.error('Failed to load medium-res image:', medRes);
        };

        // Start loading medium resolution image
        medImg.src = medRes;

        // Cleanup function: runs when component unmounts or location.pathname changes
        return () => {
            isMounted = false; // Mark as unmounted/stale
            // Prevent state updates from ongoing loads by removing handlers
            medImg.onload = null;
            medImg.onerror = null;
            highImg.onload = null;
            highImg.onerror = null;
        };
    }, [location.pathname]); // Re-run effect only when the route changes

    return (
        <div
            className="min-h-screen h-screen flex flex-col text-white bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${currentBg}')` }}
        >
            <Header />
            <main className="flex-1 overflow-hidden">
                <Routes>
                    <Route path="/" element={<Navigate to="/whiskeygoggles" replace />} />
                    <Route path="/whiskeygoggles" element={<WhiskeyGoggles />} />
                    <Route path="/bob" element={<Bob />} />
                    <Route path="/honeybarrel" element={<HoneyBarrel />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
