/* (c) Copyright Frontify Ltd., all rights reserved. */

import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { EditModal } from './EditModal';

const URL_ID = 'floating-button-edit-url';

vi.mock('@frontify/fondue', async (importActual) => {
    const mod = await importActual<object>();

    return {
        ...mod,
        useEditorRef: () => ({}),
        FloatingModalWrapper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    };
});

vi.mock('../floatingButtonStore', async (importActual) => {
    const mod = await importActual<object>();

    return {
        ...mod,
        floatingButtonSelectors: { url: () => 'https://frontify.test' },
    };
});

describe('EditModal', () => {
    it('should render the url as an anchor tag', () => {
        const { getByTestId } = render(<EditModal />);
        expect(getByTestId(URL_ID).tagName).toBe('A');
        expect(getByTestId(URL_ID).getAttribute('href')).toBe('https://frontify.test');
        expect(getByTestId(URL_ID).innerText).toBe('https://frontify.test');
    });
});
