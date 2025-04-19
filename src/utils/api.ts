import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
const API_VERSION = '/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const endpoints = {
    messages: {
        messages: `/${API_VERSION}/messages/`,
    },
    threads: {
        messages: (threadId: string) => `/${API_VERSION}/threads/${threadId}/messages`,
    },
    users: {
        threads: (username: string) => `/${API_VERSION}/users/${username}/threads`,
    },
};
