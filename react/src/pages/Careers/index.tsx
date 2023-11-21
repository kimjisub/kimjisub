import React, { useState } from 'react';

import careers from '../../data/careers.json';

export default function CareerPage() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="pt-16 mx-auto p-6 max-w-5xl">
      <p>Career</p>
      <p>그동안 경험했던 것들이에요.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-5 justify-center max-x-1xl">
        {careers.results.map(career => (
          <CareerItem key={career.id} project={career} />
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
  const icon = {
    emoji: <span className="mr-2">{project.icon?.emoji}</span>,
    file: (
      <img
        className="mr-2"
        style={{
          width: '24px',
          height: '24px',
        }}
        src={project.icon?.file?.url}
        alt={`${name} 아이콘`}
      />
    ),
  }[project.icon?.type ?? ''] ?? <></>;

  const onClick = () => {};

  return (
    <article
      onClick={onClick}
      className={`cursor-pointer rounded-lg border-2 border-gray-200 ${className}`}>
      <div className="h-32">
        <img
          src=""
          alt="" //{`${name} 커버 이미지`}
          onError={e => {
            e.currentTarget.src = '';
          }}
        />
      </div>
      <div className="p-2">
        <p className="text-md font-semibold flex">
          {icon}
          {name}
        </p>
        <p className="text-sm">{description}</p>
      </div>
    </article>
  );
};
