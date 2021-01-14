import chalk from "chalk";
import { getCurrentTime } from "./date";

export default class Logger {
    static info(...messages: string[]): void {
        console.log(`[${getCurrentTime()}] ${messages.join(" ")}`);
    }

    static error(...messages: string[]): void {
        console.error(chalk.red(`[${getCurrentTime()}] ${messages.join(" ")}`));
    }
}
