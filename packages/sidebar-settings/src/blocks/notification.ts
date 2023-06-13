/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export enum NotificationStyleType {
    Warning = 'Warning',
    Negative = 'Negative',
    Positive = 'Positive',
    Info = 'Info',
}

export type NotificationFooterEvent = 'design-settings.open' | 'general-settings.open';

type LinkOrEvent = { href: string; target?: '_self' | '_blank' } | { event: NotificationFooterEvent };

export declare type Footer<Label extends string> = {
    label?: Label;
} & (
    | LinkOrEvent
    | { replace?: ExtractVariables<Label> extends never ? never : Record<ExtractVariables<Label>, LinkOrEvent> }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExtractVariables<T extends string> = T extends `${infer _Start}[${infer Variable}]${infer Rest}`
    ? Variable extends string
        ? Rest extends string
            ? `${Variable}` | ExtractVariables<Rest>
            : `${Variable}`
        : never
    : never;

export const createFooter = <Label extends string>(footer: Footer<Label>) => footer as Footer<string>;

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
     * @deprecated Use `footer` instead
     */
    link?: LinkOrEvent & { label?: string };

    /**
     * The footer associated with the notification.
     */
    footer?: ReturnType<typeof createFooter> | (LinkOrEvent & { label?: string });

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
