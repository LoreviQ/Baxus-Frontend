import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import WhiskeyGoggles from './pages/WhiskeyGoggles';
import Bob from './pages/Bob';
import HoneyBarrel from './pages/HoneyBarrel';

function App() {
    const location = useLocation();
    // State to track loading completion for smoother transitions
    const [medLoaded, setMedLoaded] = useState(false);
    const [highLoaded, setHighLoaded] = useState(false);
    // State to hold the current image paths
    const [imagePaths, setImagePaths] = useState({ low: '', med: '', high: '' });

    useEffect(() => {
        let isMounted = true;
        setMedLoaded(false); // Reset loading states on route change
        setHighLoaded(false);

        // Determine image set based on route
        const isWhiskeyGoggles = location.pathname === '/whiskeygoggles';
        const lowRes = isWhiskeyGoggles ? '/bob-WG-low.webp' : '/bob-low.webp';
        const medRes = isWhiskeyGoggles ? '/bob-WG.webp' : '/bob.webp';
        const highRes = isWhiskeyGoggles ? '/bob-WG-high.webp' : '/bob-high.webp';

        // Update image paths state
        setImagePaths({ low: lowRes, med: medRes, high: highRes });

        // Preload medium resolution
        const medImg = new Image();
        medImg.onload = () => {
            if (isMounted) {
                setMedLoaded(true);
                // Preload high resolution *after* medium is loaded
                const highImg = new Image();
                highImg.onload = () => {
                    if (isMounted) {
                        setHighLoaded(true);
                    }
                };
                highImg.onerror = () => {
                    if (isMounted) console.error('Failed to load high-res image:', highRes);
                };
                highImg.src = highRes;
            }
        };
        medImg.onerror = () => {
            if (isMounted) console.error('Failed to load medium-res image:', medRes);
        };
        medImg.src = medRes; // Start loading medium

        // Cleanup
        return () => {
            isMounted = false;
            // No need to clear image handlers as new Image() objects are created each time
        };
    }, [location.pathname]);

    const bgStyleBase: React.CSSProperties = {
        position: 'absolute',
        inset: 0, // Equivalent to top: 0, right: 0, bottom: 0, left: 0
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'opacity 0.5s ease-in-out', // Smooth fade-in
    };

    return (
        // Main container is now relative to position the absolute background divs
        // Removed background style from here
        <div className="relative min-h-screen h-screen flex flex-col text-white">
            {/* Background Layers */}
            {imagePaths.low && (
                <div
                    style={{
                        ...bgStyleBase,
                        backgroundImage: `url('${imagePaths.low}')`,
                        opacity: 1, // Always visible
                        zIndex: -3, // Lowest layer
                    }}
                />
            )}
            {imagePaths.med && (
                <div
                    style={{
                        ...bgStyleBase,
                        backgroundImage: `url('${imagePaths.med}')`,
                        opacity: medLoaded ? 1 : 0, // Fade in when loaded
                        zIndex: -2, // Middle layer
                    }}
                />
            )}
            {imagePaths.high && (
                <div
                    style={{
                        ...bgStyleBase,
                        backgroundImage: `url('${imagePaths.high}')`,
                        opacity: highLoaded ? 1 : 0, // Fade in when loaded
                        zIndex: -1, // Top layer
                    }}
                />
            )}

            {/* Content */}
            <Header />
            <main className="flex-1 overflow-hidden z-0">
                {' '}
                {/* Ensure content stays above backgrounds */}
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
