export type MessageSchema = {
    _id: string;
    thread_id: string;
    sender_type: 'user' | 'BOB';
    content: string;
    created_at: string;
};

export type ThreadScema = {
    _id: string;
    username: string;
    created_at: string;
};
