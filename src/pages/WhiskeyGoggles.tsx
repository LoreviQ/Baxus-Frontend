import { useEffect, useState, ChangeEvent } from 'react';
import { predictImage } from '../utils/api';
import { PredictionResponse } from '../types/predictions';

const WhiskeyGoggles = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Whiskey Goggles';
    }, []);

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Reset state for new upload
            setImagePreview(null);
            setPrediction(null);
            setError(null);
            setIsLoading(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            try {
                const result = await predictImage(file);
                setPrediction(result);
            } catch (err) {
                console.error('Prediction failed:', err);
                setError('Failed to predict image. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="h-full flex justify-center">
            <div className="max-w-4xl w-full border-l border-r border-zinc-700 flex flex-col items-center p-6 h-full bg-black/50 backdrop-blur-md text-white">
                <h1 className="text-3xl font-bold mb-6">Whiskey Goggles</h1>

                <label
                    htmlFor="imageUpload"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mb-4"
                >
                    Upload Image
                </label>
                <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                />

                {isLoading && <p className="mt-4">Predicting...</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}

                {imagePreview && (
                    <div className="mt-6 flex flex-col items-center">
                        <img
                            src={imagePreview}
                            alt="Uploaded preview"
                            className="max-w-sm max-h-96 rounded shadow-lg"
                        />
                        {prediction && !isLoading && (
                            <div className="mt-4 text-center bg-gray-800 p-4 rounded">
                                <p className="text-xl font-semibold">{prediction.name}</p>
                                <p>Confidence: {prediction.final_score_percent.toFixed(2)}%</p>
                            </div>
                        )}
                    </div>
                )}

                {!imagePreview && !isLoading && (
                    <p className="mt-4 text-gray-400">Upload an image to get a prediction.</p>
                )}
            </div>{' '}
            {/* Closing tag for max-w-4xl div */}
        </div> // Closing tag for h-full div
    );
};

export default WhiskeyGoggles;
