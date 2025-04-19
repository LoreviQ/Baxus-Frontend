import { useEffect } from 'react';

const WhiskeyGoggles = () => {
  useEffect(() => {
    document.title = 'Whiskey Goggles';
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Whiskey Goggles Page</h1>
      <p>This is the Whiskey Goggles placeholder page.</p>
    </div>
  );
};

export default WhiskeyGoggles;