/* (c) Copyright Frontify Ltd., all rights reserved. */

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EditModal } from './EditModal';

const URL_ID = 'floating-button-edit-url';

describe('EditModal', () => {
    vi.mock('@frontify/fondue', async () => {
        const actual: object = await vi.importActual('@frontify/fondue');
        return {
            ...actual,
            useEditorRef: () => ({}),
        };
    });
    vi.mock('../floatingButtonStore', async () => {
        const actual: object = await vi.importActual('../floatingButtonStore');
        return {
            ...actual,
            floatingButtonSelectors: { url: () => 'https://frontify.com' },
        };
    });

    it('should render the url as an anchor tag', () => {
        const { getByTestId } = render(<EditModal />);
        expect(getByTestId(URL_ID).tagName).toBe('A');
        expect(getByTestId(URL_ID).getAttribute('href')).toBe('https://frontify.com');
        expect(getByTestId(URL_ID).innerText).toBe('https://frontify.com');
    });
});
