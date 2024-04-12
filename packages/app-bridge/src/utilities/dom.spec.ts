/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, test, vi } from 'vitest';

import { getDatasetByClassName } from './dom';

const createElementWithClass = (className: string) => {
    const domElement = document.createElement('div');
    domElement.classList.add(className);
    document.body.appendChild(domElement);

    return domElement;
};

const createElementWithClassAndAttribute = (className: string, attributeName: string, attributeValue: string) => {
    const domElement = createElementWithClass(className);
    domElement.setAttribute(attributeName, attributeValue);

    return domElement;
};

describe('getDatasetByClassName', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.clearAllMocks();
    });

    test('should return error if no element found', () => {
        expect(() => getDatasetByClassName('nonexistentClassName')).toThrow(
            'Could not find the DOM node via class name',
        );
    });

    test('should return list of dataset elements', () => {
        const className = 'className';
        createElementWithClassAndAttribute(className, 'data-attribute', 'value');

        const dataset = { attribute: 'value' };
        expect(getDatasetByClassName(className)).toEqual(dataset);
    });

    test('should return list of jquery dataset elements', () => {
        const className = 'className';
        const dataset = { attribute: 'value' };
        const domElement = createElementWithClass(className);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        domElement.jQuery12345678 = dataset;

        expect(getDatasetByClassName(className)).toEqual(dataset);
    });

    test('should return list of jquery dataset and normal DOM dataset elements', () => {
        const className = 'className';
        const domElement = createElementWithClassAndAttribute(className, 'data-dom-attribute', 'value');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        domElement.jQuery12345678 = { jQueryAttribute: 'value' };

        const dataset = { jQueryAttribute: 'value', domAttribute: 'value' };
        expect(getDatasetByClassName(className)).toEqual(dataset);
    });
});
