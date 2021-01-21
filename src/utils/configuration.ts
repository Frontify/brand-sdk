import Conf from "conf";

export class Configuration {
    private static readonly conf = new Conf({
        projectName: "frontify-block-cli",
    });

    static set(key: string, value: unknown): void {
        this.conf.set(key, value);
    }

    static get(key: string): unknown {
        return this.conf.get(key);
    }
}
