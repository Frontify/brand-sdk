import chokidar from "chokidar";
import { debounce } from "lodash";
import path from "path";

export const watch = (
    watchPath: string,
    callback: (event: string, eventPath: string) => void,
    ignored: string[] = [],
): chokidar.FSWatcher => {
    return chokidar
        .watch(watchPath, {
            ignored: ignored.map((s) => path.resolve(watchPath, s)),
        })
        .on("all", debounce(callback, 200));
};
