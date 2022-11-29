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
    type: 'notification';
    title?: string;
    text?: string;
    link?: Link;
    styles: {
        type: NotificationStyleType;
        icon?: boolean;
        divider?: NotificationBlockDividerPosition;
    };
} & BaseBlock<AppBridge>;
