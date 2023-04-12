import { useEffect, useState } from 'react';
import { projects } from '../data/projects';
import { Project } from '../models/Project';

const QUERY_KEY_PROJECTS = 'project';

export const useProjects = (filter: {}) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(
      Object.values(projects).sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      ),
    );
  }, [filter]);
  return projects;
};
