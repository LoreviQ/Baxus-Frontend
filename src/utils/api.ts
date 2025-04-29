import axios from 'axios';
import { PredictionResponse } from '../types/predictions';

const API_BASE_URL = import.meta.env.PROD
    ? 'https://baxus-bob-1037939514360.europe-west1.run.app'
    : 'http://localhost:3000';
const API_VERSION = '/api/v1';

export const bobApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const endpoints = {
    messages: {
        messages: `${API_VERSION}/messages/`,
    },
    threads: {
        messages: (threadId: string) => `${API_VERSION}/threads/${threadId}/messages`,
    },
    users: {
        threads: (username: string) => `${API_VERSION}/users/${username}/threads`,
    },
};

export async function predictImage(image: File): Promise<PredictionResponse> {
    const formData = new FormData();
    // Ensure the key 'image' matches what your backend expects
    formData.append('image', image);

    try {
        const response = await axios.post<PredictionResponse>(
            'http://127.0.0.1:5000/predict',
            formData
        );
        return response.data;
    } catch (error) {
        console.error('Error predicting image:', error);
        throw error;
    }
}
