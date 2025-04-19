'use client';

import React from 'react';

export interface IconProps {
    className?: string;
}

export type IconComponent = React.FC<IconProps>;

const Icons = {
    RightArrowIcon: function ({ className }: IconProps) {
        return (
            <svg
                className={className}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
            </svg>
        );
    },
};

export const { RightArrowIcon } = Icons;
