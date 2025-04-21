import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
    content: string;
    className?: string;
}

// Function to convert hashtags to markdown links
function processHashtags(content: string): string {
    if (!content) return '';
    // Match hashtags that start with # and contain letters, numbers, and underscores
    return content.replace(/#(\w+)/g, '[$&](/search?hashtag=$1)');
}

export function MarkdownContent({ content = '', className = '' }: MarkdownContentProps) {
    const processedContent = processHashtags(content);

    return (
        <div className="markdown-content">
            <ReactMarkdown
                components={{
                    p: ({ children }) => (
                        <p
                            className={`whitespace-pre-wrap prose prose-invert prose-sm max-w-none ${className}`}
                        >
                            {children}
                        </p>
                    ),
                    a: ({ href, children }) => (
                        <a href={href} className="text-sky-500 hover:underline">
                            {children}
                        </a>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-outside ml-6 space-y-2 [&_ol]:mt-1 [&_ul]:mt-1">
                            {children}
                        </ol>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-outside ml-6 space-y-1 [&_ol]:mt-1 [&_ul]:mt-1">
                            {children}
                        </ul>
                    ),
                    li: ({ children }) => {
                        const hasNestedList = React.Children.toArray(children).some(
                            child =>
                                React.isValidElement(child) &&
                                'type' in child &&
                                (child.type === 'ul' || child.type === 'ol')
                        );
                        return (
                            <li className={`pl-2 ${hasNestedList ? 'space-y-1' : ''}`}>
                                {children}
                            </li>
                        );
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
