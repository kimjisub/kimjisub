import { projects } from '../data/projects';

import { useQuery } from '@tanstack/react-query';

const QUERY_KEY_PROJECTS = 'project';

export const useProjects = () => {
  return useQuery([QUERY_KEY_PROJECTS], async () => {
    return projects;
  });
};
