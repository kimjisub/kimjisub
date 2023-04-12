import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import { Content, Title, Title2 } from '../../typography';
import { Build } from '@mui/icons-material';
import { projects } from '@site/src/db/data/projects';
import { useProjects } from '@site/src/db/services/projects';
import { Tech } from '@site/src/db/models/Tech';

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
            <div
              key={key}
              className={clsx(styles.project)}
              onClick={() => setSelected(key)}>
              <div className={clsx(styles.title)}>{project.name}</div>
              <div className={clsx(styles.description)}>
                {project.description}
              </div>

              {/* show project detail */}
              {selected === key && (
                <div className={clsx(styles.detail)}>
                  <div className={clsx(styles.detailTitle)}>Detail</div>
                  <div className={clsx(styles.detailDescription)}>
                    {/* show project techs */}
                    <div className={clsx(styles.techs)}>
                      {project.techs.map(tech => (
                        <div
                          key={tech.toString()}
                          className={clsx(styles.tech)}>
                          {tech instanceof Tech ? tech.name : tech}

                          {/* show project images */}
                          {/* <div className={clsx(styles.images)}>
                          {project.images.map(image => (
                            <img key={image} className={clsx(styles.image)} />
                          ))}
                        </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
