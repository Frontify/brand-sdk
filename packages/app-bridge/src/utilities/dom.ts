/* (c) Copyright Frontify Ltd., all rights reserved. */

export const getDatasetByElement = <T = Record<string, unknown>>(element: HTMLElement): T => {
    const jqueryDataset = Object.keys(element)
        .filter((property) => property.startsWith('jQuery'))
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .reduce((stack, key) => ({ ...stack, ...element[key] }), {});
    return { ...element.dataset, ...jqueryDataset } as T;
};

export const getDatasetByClassName = <T = Record<string, unknown>>(className: string): T => {
    const element = document.getElementsByClassName(className)[0] as HTMLElement;
    if (!element) {
        throw new Error('Could not find the DOM node via class name');
    }

    return getDatasetByElement(element);
};
