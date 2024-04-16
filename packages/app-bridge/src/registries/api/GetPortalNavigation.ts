/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PortalNavigationItem } from '../../types/Guideline';

export type GetPortalNavigationResponse = PortalNavigationItem[];

export const getPortalNavigation = () => ({ name: 'getPortalNavigation' });
