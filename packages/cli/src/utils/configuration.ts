/* (c) Copyright Frontify Ltd., all rights reserved. */

import Conf from 'conf';

export class Configuration {
    private static readonly conf = new Conf<Record<string, string | undefined>>({
        projectName: 'frontify-cli',
    });

    static set(key: string, value: unknown): void {
        this.conf.set(key, value);
    }

    static get(key: string): string | undefined {
        return this.conf.get(key, undefined);
    }

    static delete(key: string): void {
        return this.conf.delete(key);
    }
}
