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
        <div className="h-full flex justify-center">
            <div className="max-w-2xl w-full border-l border-r border-zinc-700 flex flex-col h-full bg-black/50 backdrop-blur-md">
                <MessagesContentComponent />
            </div>
        </div>
    );
};

export default Bob;

const MessagesContentComponent = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageSchema[]>([]);
    const [threads, setThreads] = useState<ThreadScema[]>([]);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messageSending, setMessageSending] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load messages when currentThreadId changes
    useEffect(() => {
        const loadThreadMessages = async () => {
            if (!username) return;

            if (!currentThreadId) {
                setMessages([]);
                return;
            }

            setMessagesLoading(true);
            try {
                const messagesResponse = await api.get(endpoints.threads.messages(currentThreadId));
                console.log('Messages:', messagesResponse.data);
                setMessages(messagesResponse.data.messages || []);
            } catch (error) {
                console.error('Failed to load messages:', error);
                setStatusMessage('Failed to load messages. Please try again.');
            } finally {
                setMessagesLoading(false);
            }
        };

        loadThreadMessages();
    }, [currentThreadId, username]);

    // Modify the initial useEffect to only load threads, not messages
    useEffect(() => {
        const loadThreads = async () => {
            if (!username) return;

            try {
                const threadsResponse = await api.get(endpoints.users.threads(username));
                console.log('Threads:', threadsResponse.data);
                const threads: ThreadScema[] = threadsResponse.data.threads;
                setThreads(threads);
                if (threads && threads.length > 0) {
                    setCurrentThreadId(threads[0]._id);
                }
            } catch (error) {
                console.error('Failed to load threads:', error);
                setStatusMessage('Failed to load threads. Please try again.');
            }
        };

        loadThreads();
    }, [username]);

    const sendMessage = async (content: string) => {
        setMessageSending(true);
        try {
            const newUserMessage: MessageSchema = {
                _id: crypto.randomUUID(),
                thread_id: currentThreadId || '',
                sender_type: 'user',
                content,
                created_at: new Date().toISOString(),
            };
            const payload = {
                username,
                thread: currentThreadId,
                content,
            };
            console.log('Sending message:', payload);
            const response = await api.post(endpoints.messages.messages, payload);

            const newBobMessage = response.data.message;
            if (!currentThreadId && newBobMessage.thread_id) {
                setCurrentThreadId(newBobMessage.thread_id);
                newUserMessage.thread_id = newBobMessage.thread_id;
                // Add the new thread to the threads state
                const newThread: ThreadScema = {
                    _id: newBobMessage.thread_id,
                    username: username || '',
                    created_at: new Date().toISOString(),
                };
                setThreads(prev => [newThread, ...prev]);
            }

            setMessages(prev => [...prev, newUserMessage, newBobMessage]);
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
        <div className="flex flex-col h-full">
            <ChatHeader
                username={username}
                threads={threads}
                currentThreadId={currentThreadId}
                setCurrentThreadId={setCurrentThreadId}
            />
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 flex flex-col-reverse">
                    {statusMessage ? (
                        <div className="flex justify-center items-center text-zinc-500">
                            {statusMessage}
                        </div>
                    ) : (
                        <>
                            <div ref={messagesEndRef} />
                            {[...messages].reverse().map(message => (
                                <ChatMessage key={message._id} message={message} />
                            ))}
                        </>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 p-4 border-t border-zinc-700 bg-black">
                <div className="relative group w-full">
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={e => {
                            setInputValue(e.target.value);
                            // Auto-resize the textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                        }}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={messageSending}
                        className="w-full bg-black border border-zinc-600 rounded-xl py-2 pr-10 pl-4 text-white placeholder-zinc-400 focus:border-white focus:outline-none transition-colors duration-200 resize-none overflow-y-auto max-h-[200px]"
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

interface ChatHeaderProps {
    username: string | null;
    threads: ThreadScema[];
    currentThreadId: string | null;
    setCurrentThreadId: (threadId: string | null) => void;
}
function ChatHeader({ username, threads, currentThreadId, setCurrentThreadId }: ChatHeaderProps) {
    return (
        <>
            {username && (
                <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-zinc-700">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center gap-2">
                            <select
                                value={currentThreadId || ''}
                                onChange={e => setCurrentThreadId(e.target.value || null)}
                                className="bg-transparent text-white border border-zinc-600 rounded px-2 py-1 text-sm focus:border-white focus:outline-none"
                            >
                                <option value="">New Thread</option>
                                {threads.map(thread => (
                                    <option key={thread._id} value={thread._id}>
                                        Thread {thread._id.slice(0, 8)}...
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => setCurrentThreadId(null)}
                                className="w-6 h-6 flex items-center justify-center text-white border border-zinc-600 rounded hover:border-white transition-colors duration-200"
                                title="New Thread"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
