import React, { useState } from 'react';

import projects from '../../data/projects.json';

export default function ProjectsSection() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="mx-auto p-20 max-w-5xl">
      <p>Projects</p>
      <p>그동안 진행해왔던 프로젝트들이에요.</p>

      <div className="grid grid-cols-3 gap-4 mt-5">
        {projects.results.map(project => (
          <div
            key={project.id}
            className="text-center rounded-lg border-2 border-gray-400 h-75 p-4">
            <ProjectItem project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}

type Project = (typeof projects.results)[number];

interface ProjectItemProps {
  project: Project;
  className?: string;
}
const ProjectItem = ({ project, className }: ProjectItemProps) => {
  const name = project.properties.이름.title?.[0]?.text?.content;
  const description = project.properties.설명.rich_text[0]?.plain_text;

  const onClick = () => {};

  return (
    <article onClick={onClick} className={`h-40 cursor-pointer ${className}`}>
      <p className="text-lg font-semibold">{name}</p>
      <p className="text-sm">{description}</p>
    </article>
  );
};
