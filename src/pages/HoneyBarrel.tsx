import { TitleLink } from '../components/TitleLink';
import { useEffect } from 'react';

const HoneyBarrel = () => {
    useEffect(() => {
        document.title = 'Honey Barrel';
    }, []);

    // Updated direct download link
    const downloadUrl =
        'https://github.com/LoreviQ/Baxus-Honey-Barrel/releases/download/v1.0.0/honeybarrel.zip';

    return (
        <div className="h-full flex justify-center overflow-y-auto">
            <div className="max-w-4xl w-full border-l border-r border-zinc-700 flex flex-col h-full bg-black/50 backdrop-blur-md p-8">
                {/* Added text-center */}
                <div className="text-center mb-4">
                    <TitleLink href="https://github.com/LoreviQ/Baxus-Honey-Barrel">
                        Baxus Honey Barrel (BOB)
                    </TitleLink>
                </div>

                <div className="space-y-6 text-zinc-300">
                    <div className="bg-zinc-800/50 p-4 rounded-md">
                        {/* Added text-center */}
                        <h2 className="text-xl font-semibold mb-3 text-yellow-300 text-center">
                            How it Works
                        </h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                BOB automatically scans supported retailer sites (like The Whisky
                                Exchange & Flask Fine Wines) for bottle details.
                            </li>
                            <li>
                                It checks the BAXUS marketplace for better prices on the same
                                bottle.
                            </li>
                            <li>
                                If a saving is found, BOB alerts you with a link to the BAXUS
                                listing.
                            </li>
                            <li>
                                Includes "Whiskey Goggles" feature: Select an image on any page to
                                identify the bottle using a local service.
                            </li>
                        </ul>
                        <p className="mt-4">
                            For more detailed information, source code, and development
                            instructions, please visit the{' '}
                            <a
                                href="https://github.com/LoreviQ/Baxus-Honey-Barrel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-400 hover:underline"
                            >
                                GitHub repository
                            </a>
                            .
                        </p>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-md">
                        {/* Added text-center */}
                        <h2 className="text-xl font-semibold mb-3 text-yellow-300 text-center">
                            Installation (Unpacked Extension)
                        </h2>
                        <ol className="list-decimal list-inside space-y-2 mb-3">
                            <li>
                                Download the extension <code>.zip</code> file from the link above
                                and unzip it. This will create a folder (likely named{' '}
                                <code>dist</code> or similar).
                            </li>
                            <li>
                                Open Google Chrome and navigate to <code>chrome://extensions/</code>
                                .
                            </li>
                            <li>
                                Enable "Developer mode" using the toggle switch, usually found in
                                the top-right corner.
                            </li>
                            <li>Click the "Load unpacked" button.</li>
                            <li>Select the folder you unzipped in Step 1.</li>
                            <li>
                                BOB is ready! Look for the BAXUS Honey Barrel icon in your Chrome
                                extensions toolbar.
                            </li>
                        </ol>
                        <div className="flex justify-center">
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                            >
                                Download Extension (.zip)
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HoneyBarrel;
