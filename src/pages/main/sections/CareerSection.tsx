import React, { useState } from 'react';

import careers from '../data/careers.json';

export default function CareerSection() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="mx-auto p-20 max-w-6xl">
      <p>Projects</p>
      <p>그동안 진행해왔던 프로젝트들이에요.</p>

      <div className="grid grid-cols-3 gap-4 mt-5">
        {careers.results.map(career => (
          <div
            key={career.id}
            className="text-center rounded-lg border-2 border-gray-400 h-75 p-4">
            <CareerItem project={career} />
          </div>
        ))}
      </div>
    </div>
  );
}

type Career = (typeof careers.results)[number];

interface CareerItemProps {
  project: Career;
  className?: string;
}

const CareerItem = ({ project, className }: CareerItemProps) => {
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
