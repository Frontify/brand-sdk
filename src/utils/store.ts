import Conf from "conf";

const conf = new Conf({ projectName: "frontify-block-cli" });

export class Configuration {
    static set(key: string, value: unknown): void {
        conf.set(key, value);
    }

    static get(key: string): unknown {
        return conf.get(key);
    }
}
