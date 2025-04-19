import { useEffect, useState, useRef } from 'react';
import { MessageSchema, ThreadScema } from '../types/messages';
import { RightArrowIcon } from '../assets/icons';
import { MarkdownContent } from '../components/MarkdownContent';
import { formatFriendlyDate } from '../utils/date';
import { api, endpoints } from '../utils/api';

const Bob = () => {
    useEffect(() => {
        document.title = 'BOB';
    }, []);

    return (
        <div className="flex justify-center h-full">
            <div className="max-w-4xl w-full border-l border-r border-white">
                <MessagesContentComponent />
            </div>
        </div>
    );
};

export default Bob;

const MessagesContentComponent = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageSchema[]>([]);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messageSending, setMessageSending] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load messages when username and thread are set
    useEffect(() => {
        const loadMessages = async () => {
            if (!username) return;

            setMessagesLoading(true);
            try {
                // First get user's threads
                const threadsResponse = await api.get(endpoints.users.threads(username));
                console.log('Threads:', threadsResponse.data);
                const threads: ThreadScema[] = threadsResponse.data.threads;

                if (threads && threads.length > 0) {
                    const threadId = threads[0]._id;
                    setCurrentThreadId(threadId);

                    // Then get messages for the first thread
                    const messagesResponse = await api.get(endpoints.threads.messages(threadId));
                    console.log('Messages:', messagesResponse.data);
                    setMessages(messagesResponse.data.messages || []);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Failed to load messages:', error);
                setStatusMessage('Failed to load messages. Please try again.');
            } finally {
                setMessagesLoading(false);
            }
        };

        loadMessages();
    }, [username]);

    const sendMessage = async (content: string) => {
        setMessageSending(true);
        try {
            const payload = {
                username,
                thread: currentThreadId,
                content,
            };
            console.log('Sending message:', payload);
            const response = await api.post(endpoints.messages.messages);

            const newMessage = response.data.message;
            if (!currentThreadId && newMessage.thread_id) {
                setCurrentThreadId(newMessage.thread_id);
            }

            setMessages(prev => [...prev, newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        } finally {
            setMessageSending(false);
        }
    };

    // Focus textarea on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Set status message based on current state
    useEffect(() => {
        if (!username) {
            setStatusMessage(null);
            return;
        }

        if (messagesLoading) {
            setStatusMessage('Loading messages...');
            return;
        }

        if (messages.length === 0) {
            setStatusMessage('No messages yet...');
            return;
        }

        setStatusMessage(null);
    }, [messagesLoading, messages.length, username]);

    const handleSendMessage = async () => {
        const trimmedContent = inputValue.trim();
        if (trimmedContent && !messageSending) {
            try {
                setInputValue('');
                await sendMessage(trimmedContent);
                // Add a small delay before focusing or it won't work
                setTimeout(() => {
                    textareaRef.current?.focus();
                }, 0);
            } catch (error) {
                console.error('Failed to send message:', error);
                // Restore the input value on error
                setInputValue(trimmedContent);
            }
        }
    };

    // Send message on Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!username) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4 text-center">
                        Enter your username to start chatting
                    </h2>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full bg-black border border-zinc-600 rounded-xl py-2 px-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200"
                            placeholder="Username"
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    const value = e.currentTarget.value.trim();
                                    if (value) {
                                        setUsername(value);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 h-full">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
                <div>
                    {statusMessage ? (
                        <div className="flex justify-center items-center text-zinc-500">
                            {statusMessage}
                        </div>
                    ) : (
                        messages.map(message => <ChatMessage key={message._id} message={message} />)
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input field */}
            <div className="p-4 border-t border-zinc-700">
                <div className="relative group w-full">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={e => {
                            setInputValue(e.target.value);
                            // Auto-resize the textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={messageSending}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 pr-10 pl-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 resize-none overflow-hidden disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || messageSending}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 disabled:opacity-50"
                    >
                        <RightArrowIcon className="w-5 h-5 text-zinc-400 transition-colors duration-200 group-focus-within:text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ChatMessageProps {
    message: MessageSchema;
}

function ChatMessage({ message }: ChatMessageProps) {
    const isCharacter = message.sender_type === 'BOB';

    return (
        <div className={`flex ${isCharacter ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[75%] rounded-lg px-4 py-2 relative ${
                    isCharacter
                        ? 'bg-zinc-700 text-white before:absolute before:content-[""] before:w-4 before:h-4 before:bg-zinc-700 before:-bottom-2 before:right-2 before:skew-x-[35deg] before:rounded-bl-lg'
                        : 'bg-blue-800 text-white before:absolute before:content-[""] before:w-4 before:h-4 before:bg-blue-800 before:-bottom-2 before:left-2 before:skew-x-[-35deg] before:rounded-br-lg'
                }`}
            >
                <MarkdownContent content={message.content} className="break-words" />
                <div
                    className={`text-xs text-zinc-400 mt-1 ${isCharacter ? 'text-left' : 'text-right'}`}
                >
                    {formatFriendlyDate(new Date(message.created_at))}
                </div>
            </div>
        </div>
    );
}
