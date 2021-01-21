import { red } from "chalk";
import { getCurrentTime } from "./date";

export default class Logger {
    static defaultInfo(...messages: string[]): void {
        console.log(Logger.spacer(11), ...messages);
    }

    static info(...messages: string[]): void {
        console.log(`[${getCurrentTime()}] ${messages.join(" ")}`);
    }

    static error(...messages: string[]): void {
        console.error(red(`[${getCurrentTime()}] ${messages.join(" ")}`));
    }

    static spacer(width = 1): string {
        return Array(width + 1).join(" ");
    }
}
