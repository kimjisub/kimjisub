import React, { useState } from 'react';

import projects from '../../data/projects.json';

export default function ProjectsPage() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="pt-16 mx-auto p-6 max-w-4xl">
      <p>Projects</p>
      <p>그동안 진행해왔던 프로젝트들이에요.</p>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 justify-center max-x-1xl"
        style={
          {
            // gridTemplateColumns: 'repeat(auto-fill, 20rem)',
          }
        }>
        {projects.results.map(project => (
          <ProjectItem key={project.id} project={project} />
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
    <article
      onClick={onClick}
      className={`cursor-pointer rounded-lg border-2 border-gray-200 ${className}`}>
      <div className="h-32 bg-red-500">
        <img src="" alt="이미지"></img>
      </div>
      <div className="p-2">
        <p className="text-md font-semibold">{name}</p>
        <p className="text-sm">{description}</p>
      </div>
    </article>
  );
};
