/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { getToolbarButtonClassNames } from './helpers';

type BaseToolbarButtonProps = {
    children: ReactNode;
    forceActiveStyle?: boolean;
    cursor?: 'pointer' | 'grab';
} & HTMLAttributes<HTMLButtonElement>;

export const BaseToolbarButton = forwardRef<HTMLButtonElement, BaseToolbarButtonProps>(
    ({ onClick, children, forceActiveStyle, cursor = 'pointer', ...props }, ref) => (
        <button
            data-test-id="block-item-wrapper-toolbar-btn"
            onClick={onClick}
            className={getToolbarButtonClassNames(cursor, forceActiveStyle)}
            {...props}
            ref={ref}
        >
            {children}
        </button>
    ),
);

BaseToolbarButton.displayName = 'BaseToolbarButton';
