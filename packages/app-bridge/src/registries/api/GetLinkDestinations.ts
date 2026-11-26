/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type LinkDestination } from '../../types';

export type GetLinkDestinationsPayload = {
    /** Text to match against the titles of documents, library documents, pages and page headings. */
    query: string;
};

/** Destinations whose title matches the query, in the host's tree order. Empty for an empty query. */
export type GetLinkDestinationsResponse = LinkDestination[];

export const getLinkDestinations = (payload: GetLinkDestinationsPayload) => ({ name: 'getLinkDestinations', payload });
