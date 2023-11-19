import { useEffect, useState } from 'react';
import { projectDB } from '../data/projects';
import { Project } from '../models/Project';

const QUERY_KEY_PROJECTS = 'project';

export const useProjects = ({}: {}) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(
      Object.values(projectDB).sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      ),
    );
  }, []);
  return projects;
};
