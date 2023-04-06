import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import { Content, Title, Title2 } from '../../typography';
import { Build } from '@mui/icons-material';
import { projects } from '@site/src/db/data/projects';
import { useProjects } from '@site/src/db/services/projects';

export default function Projectes() {
  const [selected, setSelected] = useState(null);
  const { data: projects } = useProjects();
  return (
    <div className={clsx(styles.root)}>
      <Title>
        <Build />
        Projectes
      </Title>
      <Title2>그동안 진행해왔던 프로젝트들이에요.</Title2>

      {/* show project using projects */}
    </div>
  );
}
