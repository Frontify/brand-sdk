import { URL } from "url";

export const getValidInstanceUrl = (url: string): string => {
    const cleanHost = url.replace(/^https?:\/\//, "");
    const parsedUrl = new URL(`https://${cleanHost}`);
    return parsedUrl.hostname;
};
