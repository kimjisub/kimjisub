import React, { useState } from 'react';
import { Build } from '@mui/icons-material';
import { useProjects } from '@site/src/db/services/projects';
import { Title, Title2 } from '@site/src/typography';
import styled from 'styled-components';

import ProjectItem from '../ProjectItem';

const Root = styled.div`
  max-width: 1000px;
  padding: 5em 0;
  margin: 0 auto;

  .text {
    text-align: end;
    align-self: center;
    padding: 0;
    padding-right: 10px;
  }

  .icons {
    > * {
      float: left;
      margin: 10px;
    }
    padding: 0;
  }

  .table {
    width: fit-content;
    margin: auto;

    tr {
      border: none;

      &:nth-child(2n) {
        background-color: #0000;
      }

      td {
        border: none;
      }
    }
  }
`;

const ProjectsWrapper = styled.div`
  // Add your styles for .projects here
`;

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const projects = useProjects({});
  return (
    <Root>
      <Title>
        <Build />
        Projectes
      </Title>
      <Title2>그동안 진행해왔던 프로젝트들이에요.</Title2>

      {/* show project using projects */}
      <ProjectsWrapper>
        {projects &&
          Object.entries(projects)?.map(([key, project]) => (
            <ProjectItem
              key={key}
              project={project}
              openDetail={selected === key}
              onClick={() => setSelected(selected !== key ? key : null)}
            />
          ))}
      </ProjectsWrapper>
    </Root>
  );
}
