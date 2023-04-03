/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

export enum NotificationStyleType {
    Warning = 'Warning',
    Negative = 'Negative',
    Positive = 'Positive',
    Info = 'Info',
}

export type NotificationLinkEvent = 'design-settings.open';

type LinkOrEvent = { href: string; target?: '_self' | '_blank' } | { event: NotificationLinkEvent };

export declare type Link<Label extends string> = {
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

export const createLink = <Label extends string>(link: Link<Label>) => link as Link<string>;

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
    footer?: ReturnType<typeof createLink> | (LinkOrEvent & { label?: string });

    /**
     * Customization of the notification setting.
     */
    styles: {
        /**
         * The type of notification.
         */
        type: NotificationStyleType;

        /**
         * Indicates if the notification should include an icon.
         */
        icon?: boolean;

        /**
         * The position of the divider in the notification.
         */
        divider?: NotificationBlockDividerPosition;
    };
} & BaseBlock<AppBridge>;
