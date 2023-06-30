/* (c) Copyright Frontify Ltd., all rights reserved. */

type TextElement = {
    text: string;
    children?: TextElement[];
};

export const hasRichTextValue = (string?: string): boolean => {
    if (!string) {
        return false;
    }
    const hasText = (children: TextElement[]): boolean =>
        children.some((child: TextElement) => {
            if (child.text) {
                return child.text !== '';
            }
            if (child.children) {
                return hasText(child.children);
            }
            return false;
        });

    try {
        const json = JSON.parse(string);
        return hasText(json);
    } catch (error) {
        return false;
    }
};
