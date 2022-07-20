/* (c) Copyright Frontify Ltd., all rights reserved. */

import colors from 'colors/safe';
import { getCurrentTime } from './date';

export default class Logger {
    static defaultInfo(...messages: string[]): void {
        console.log(Logger.spacer(10), ...messages);
    }

    static info(...messages: string[]): void {
        console.log(`[${getCurrentTime()}] ${messages.join(' ')}`);
    }

    static success(...messages: string[]): void {
        console.log(`[${getCurrentTime()}] ${colors.green(messages.join(' '))}`);
    }

    static error(...messages: string[]): void {
        console.error(colors.red(`[${getCurrentTime()}] ${messages.join(' ')}`));
    }

    static spacer(width = 1): string {
        return Array(width + 1).join(' ');
    }
}
