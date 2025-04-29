import { useEffect, useState, ChangeEvent, useRef } from 'react';
// Import the new health check function
import { predictImage, checkWhiskeyGogglesHealth } from '../utils/api';
import { PredictionResponse } from '../types/predictions';

// --- Extracted Components ---

interface TitleLinkProps {
    href: string;
    children: React.ReactNode;
}

// Component for the title link with hover effect
const TitleLink: React.FC<TitleLinkProps> = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-3xl font-bold mb-6 hover:text-yellow-300 transition-colors duration-200 ease-in-out"
    >
        {children}
    </a>
);

interface HealthCheckStatusProps {
    isChecking: boolean;
    isLive: boolean | null;
    repoUrl: string;
}

// Component to display the health check status or error message
const HealthCheckStatus: React.FC<HealthCheckStatusProps> = ({ isChecking, isLive, repoUrl }) => {
    if (isChecking) {
        return <p className="mt-4 text-yellow-300">Checking Whiskey Goggles service status...</p>;
    }
    if (isLive === false) {
        return (
            <div className="mt-4 text-red-500 text-center bg-red-900/30 p-4 rounded w-full max-w-sm">
                <p>The Whiskey Goggles service is not reachable.</p>
                <p>Please ensure it is running locally.</p>
                <p>
                    Find instructions at:{' '}
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-red-300"
                    >
                        {repoUrl} {/* Display the link text */}
                    </a>
                </p>
            </div>
        );
    }
    return null; // Render nothing if live or not yet checked
};

interface ImageUploadAreaProps {
    imagePreview: string | null;
    isLoading: boolean;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    isDisabled: boolean; // Added to disable interaction when service is down
}

// Component for the image upload area
const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
    imagePreview,
    isLoading,
    onClick,
    onKeyDown,
    isDisabled,
}) => (
    <div
        onClick={!isDisabled ? onClick : undefined} // Only allow click if not disabled
        className={`w-full max-w-sm h-120 flex items-center justify-center border border-dashed border-gray-500 rounded-lg mb-4 transition-colors duration-200 ease-in-out ${
            isDisabled
                ? 'cursor-not-allowed bg-zinc-700/50' // Style for disabled state
                : isLoading
                  ? 'cursor-wait'
                  : 'cursor-pointer hover:border-gray-400'
        } ${!imagePreview && !isDisabled ? 'bg-black/80' : ''}`}
        aria-label="Upload image"
        role={!isDisabled ? 'button' : undefined} // Role only if interactive
        tabIndex={!isDisabled ? 0 : -1} // Focusable only if interactive
        onKeyDown={!isDisabled ? onKeyDown : undefined} // Keyboard interaction only if interactive
    >
        {imagePreview ? (
            <img
                src={imagePreview}
                alt="Uploaded preview"
                className="max-w-full max-h-full object-contain rounded-lg"
            />
        ) : (
            <span className={`text-gray-400 ${isDisabled ? 'text-gray-600' : ''}`}>
                {isDisabled ? 'Service Unavailable' : 'Upload Image'}
            </span>
        )}
    </div>
);

interface PredictionResultProps {
    prediction: PredictionResponse | null;
}

// Component to display the prediction result
const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
    if (!prediction) return null;
    return (
        <div className="mt-4 text-center bg-zinc-800 p-4 rounded w-full max-w-sm">
            <p className="text-sm text-gray-400">ID: {prediction.id}</p>
            <p className="text-xl font-semibold">{prediction.name}</p>
            <p>Confidence: {prediction.final_score_percent.toFixed(2)}%</p>
        </div>
    );
};

// --- Main Component ---

const WhiskeyGoggles = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading for prediction
    const [error, setError] = useState<string | null>(null);
    // State for health check
    const [isServiceLive, setIsServiceLive] = useState<boolean | null>(null); // null: unchecked, true: live, false: down
    const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(true); // Loading for health check
    const fileInputRef = useRef<HTMLInputElement>(null);
    const repoUrl = 'https://github.com/LoreviQ/Baxus-Whisky-Goggles'; // Define repo URL once

    useEffect(() => {
        document.title = 'Whiskey Goggles';
        // Perform health check on mount
        const checkHealth = async () => {
            setIsCheckingHealth(true); // Start loading state for health check
            try {
                const live = await checkWhiskeyGogglesHealth();
                setIsServiceLive(live);
            } catch (e) {
                console.error('Health check failed:', e);
                setIsServiceLive(false); // Assume not live on error
            } finally {
                setIsCheckingHealth(false); // End loading state for health check
            }
        };
        checkHealth();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Only proceed if service is live and a file exists
        if (file && isServiceLive) {
            setImagePreview(null);
            setPrediction(null);
            setError(null);
            setIsLoading(true); // Start loading state for prediction

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
                // Clear preview and prediction on error
                setImagePreview(null);
                setPrediction(null);
            } finally {
                setIsLoading(false); // End loading state for prediction
            }
            // Reset file input value
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } else if (!isServiceLive) {
            setError('Cannot upload image: Whiskey Goggles service is not running.');
            // Reset file input if service is down and user somehow triggered it
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Function to trigger file input click
    const triggerFileInput = () => {
        // Allow triggering only if service is live and not currently loading a prediction
        if (isServiceLive && !isLoading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Determine if the main UI should be disabled (service down or checking)
    const isUiDisabled = !isServiceLive || isCheckingHealth;

    return (
        <div className="h-full flex justify-center">
            <div className="max-w-4xl w-full border-l border-r border-zinc-700 flex flex-col items-center p-6 h-full bg-black/50 backdrop-blur-md text-white">
                {/* Use the TitleLink component */}
                <TitleLink href={repoUrl}>Whiskey Goggles</TitleLink>

                {/* Display health status */}
                <HealthCheckStatus
                    isChecking={isCheckingHealth}
                    isLive={isServiceLive}
                    repoUrl={repoUrl}
                />

                {/* Hidden File Input - Disable based on UI state */}
                <input
                    ref={fileInputRef}
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUiDisabled || isLoading} // Disable if UI is generally disabled or prediction is loading
                />

                {/* Use the ImageUploadArea component, pass disabled state */}
                <ImageUploadArea
                    imagePreview={imagePreview}
                    isLoading={isLoading}
                    onClick={triggerFileInput}
                    onKeyDown={e => e.key === 'Enter' && triggerFileInput()}
                    isDisabled={isUiDisabled} // Pass the disabled state
                />

                {/* Conditional rendering for loading/error/results, only if UI is not disabled */}
                {!isUiDisabled && (
                    <>
                        {isLoading && <p className="mt-4">Predicting...</p>}
                        {/* Display prediction error only if not loading */}
                        {error && !isLoading && <p className="mt-4 text-red-500">{error}</p>}

                        {/* Use the PredictionResult component - show only if prediction exists, not loading, no error */}
                        {!isLoading && !error && <PredictionResult prediction={prediction} />}

                        {/* Initial instruction - show only if service is live, not loading, no error, no preview, no prediction */}
                        {!imagePreview && !isLoading && !error && !prediction && (
                            <p className="mt-4 text-gray-400">
                                Click the area above to upload an image.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default WhiskeyGoggles;
