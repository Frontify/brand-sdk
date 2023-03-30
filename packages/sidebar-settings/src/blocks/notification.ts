/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export enum NotificationStyleType {
    Warning = 'Warning',
    Negative = 'Negative',
    Positive = 'Positive',
    Info = 'Info',
}

export type Link = {
    label?: string;
    href: string;
    target?: '_self' | '_blank';
};

export enum NotificationBlockDividerPosition {
    Top = 'Top',
    Bottom = 'Bottom',
    Both = 'Both',
    None = 'None',
}

export type NotificationBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'notification';

    /**
     * The title of the notification.
     */
    title?: string;

    /**
     * The text of the notification.
     */
    text?: string;

    /**
     * The link associated with the notification.
     */
    link?: Link;

    /**
     * Customization of the notification setting.
     */
    styles?: {
        /**
         * The type of notification.
         */
        type?: 'info' | 'warning' | 'negative' | 'positive' | NotificationStyleType;

        /**
         * Indicates if the notification should include an icon.
         */
        icon?: boolean;

        /**
         * The position of the divider in the notification.
         */
        divider?: 'top' | 'bottom' | 'both' | 'none' | NotificationBlockDividerPosition;
    };
} & BaseBlock<AppBridge>;
