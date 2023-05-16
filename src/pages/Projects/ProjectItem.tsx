import React from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import { Tech } from '@site/src/db/models/Tech';
import { Project } from '@site/src/db/models/Project';
import styled from 'styled-components';

const ProjectItem = ({
  project,
  openDetail,
  onClick,
}: {
  project: Project;
  openDetail: boolean;
  onClick: () => void;
}) => {
  return (
    <ProjectItemRoot onClick={onClick}>
      <ProjectItemTitle>{project.name}</ProjectItemTitle>
      <ProjectItemDescription>{project.description}</ProjectItemDescription>

      {/* show project detail */}
      {openDetail && (
        <div className={clsx(styles.detail)}>
          <div className={clsx(styles.detailTitle)}>Detail</div>
          <div className={clsx(styles.detailDescription)}>
            {/* show project techs */}
            <div className={clsx(styles.techs)}>
              {project.techs.map(tech => (
                <div key={tech.toString()} className={clsx(styles.tech)}>
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
    </ProjectItemRoot>
  );
};

export default ProjectItem;

const ProjectItemRoot = styled.div``;
const ProjectItemTitle = styled.p``;
const ProjectItemDescription = styled.p``;
