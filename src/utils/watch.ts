import chokidar from "chokidar";
import path from "path";
import debounce from "./debounce";

export const watch = (
    watchPath: string,
    callback: (event: string) => void,
    ignored: string[] = [],
): chokidar.FSWatcher => {
    return chokidar
        .watch(watchPath, {
            ignored: ignored.map((s) => path.resolve(watchPath, s)),
        })
        .on("all", debounce(callback, 200));
};
