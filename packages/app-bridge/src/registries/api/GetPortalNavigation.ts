/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PortalNavigationItem } from '../../types/NavigationTree';

export type GetPortalNavigationResponse = PortalNavigationItem[];

export const getPortalNavigation = () => ({ name: 'getPortalNavigation' });
