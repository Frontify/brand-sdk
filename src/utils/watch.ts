import chokidar from "chokidar";
import { debounce } from "lodash";

export const watch = (
    path: string,
    callback: (event: string, path: string) => void,
    ignored: string[] = [],
): chokidar.FSWatcher => {
    return chokidar
        .watch(path, {
            ignored: (path: string): boolean => ignored.some((s): boolean => path.includes(s)),
        })
        .on("all", debounce(callback, 200));
};
