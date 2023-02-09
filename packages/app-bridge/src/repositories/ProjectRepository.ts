/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Project, ProjectApi } from '../types';
import { HttpClient, convertObjectCase } from '../utilities';

export const createProject = async (project: Project): Promise<Project> => {
    const { result } = await HttpClient.post<ProjectApi>('/api/Project', convertObjectCase(project, 'snake'));

    return convertObjectCase(result.data, 'camel');
};
