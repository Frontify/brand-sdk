/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

import { getToolbarButtonClassNames } from './helpers';

type BaseToolbarButtonProps = {
    children: ReactNode;
    forceActiveStyle?: boolean;
    cursor?: 'pointer' | 'grab';
    'data-test-id'?: string;
} & HTMLAttributes<HTMLButtonElement>;

export const BaseToolbarButton = forwardRef<HTMLButtonElement, BaseToolbarButtonProps>(
    (
        {
            onClick,
            children,
            forceActiveStyle,
            cursor = 'pointer',
            'data-test-id': dataTestId = 'base-toolbar-button',
            ...props
        },
        ref,
    ) => (
        <button
            onClick={onClick}
            className={getToolbarButtonClassNames(cursor, forceActiveStyle)}
            data-test-id={dataTestId}
            {...props}
            ref={ref}
        >
            {children}
        </button>
    ),
);

BaseToolbarButton.displayName = 'BaseToolbarButton';
