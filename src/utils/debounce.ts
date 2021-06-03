// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debounce(callback: (...args: any) => void, delay: number): () => void {
    let timeoutId: NodeJS.Timeout;
    return () => {
        clearTimeout(timeoutId);
        // eslint-disable-next-line prefer-rest-params
        timeoutId = setTimeout(() => callback(arguments), delay);
    };
}
