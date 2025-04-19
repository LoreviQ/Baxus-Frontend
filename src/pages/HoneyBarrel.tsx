import { useEffect } from 'react';

const HoneyBarrel = () => {
  useEffect(() => {
    document.title = 'Honey Barrel';
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Honey Barrel Page</h1>
      <p>This is the Honey Barrel placeholder page.</p>
    </div>
  );
};

export default HoneyBarrel;