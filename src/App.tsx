import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import WhiskeyGoggles from './pages/WhiskeyGoggles';
import Bob from './pages/Bob';
import HoneyBarrel from './pages/HoneyBarrel';

function App() {
    return (
        <div className="min-h-screen flex flex-col text-white">
            <Header />
            <main className="bg-black flex-1">
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
