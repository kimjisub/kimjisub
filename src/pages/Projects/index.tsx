import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import { Content, Title, Title2 } from '../../typography';
import { Build } from '@mui/icons-material';
import { projectDB } from '@site/src/db/data/projects';
import { useProjects } from '@site/src/db/services/projects';
import { Tech } from '@site/src/db/models/Tech';
import { Project } from '@site/src/db/models/Project';
import styled from 'styled-components';
import ProjectItem from './ProjectItem';

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const projects = useProjects({});
  return (
    <div className={clsx(styles.root)}>
      <Title>
        <Build />
        Projectes
      </Title>
      <Title2>그동안 진행해왔던 프로젝트들이에요.</Title2>

      {/* show project using projects */}
      <div className={clsx(styles.projects)}>
        {projects &&
          Object.entries(projects)?.map(([key, project]) => (
            <ProjectItem
              key={key}
              project={project}
              openDetail={selected === key}
              onClick={() => setSelected(selected !== key ? key : null)}
            />
          ))}
      </div>
    </div>
  );
}
