/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Project, ProjectApi, ProjectCreate } from '../types';
import { HttpClient, convertObjectCase } from '../utilities';

export const createProject = async (project: ProjectCreate): Promise<Project> => {
    const { result } = await HttpClient.post<ProjectApi>('/api/project/add', convertObjectCase(project, 'snake'));

    return convertObjectCase(result as unknown as ProjectApi, 'camel');
};
