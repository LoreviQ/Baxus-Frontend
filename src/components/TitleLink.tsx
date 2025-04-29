export interface TitleLinkProps {
    href: string;
    children: React.ReactNode;
}

// Component for the title link with hover effect
export const TitleLink: React.FC<TitleLinkProps> = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-3xl font-bold mb-6 hover:text-yellow-300 transition-colors duration-200 ease-in-out"
    >
        {children}
    </a>
);
