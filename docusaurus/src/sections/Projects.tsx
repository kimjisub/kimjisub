import React, { useState } from 'react';
import { Build } from '@mui/icons-material';
import { Title, Title2 } from '@site/src/typography';
import styled from 'styled-components';

import projects from '../db/data/projects.json';

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

export default function Projects() {
  const [selected, setSelected] = useState(null);
  return (
    <Root>
      <Title>
        <Build />
        Projects
      </Title>
      <Title2>그동안 진행해왔던 프로젝트들이에요.</Title2>

      <GridContainer>
        {projects.results.map(project => (
          <GridItem key={project.id}>
            <ProjectItem project={project} />
            {/* <pre
              style={{
                fontSize: '0.5rem',
              }}>
              {JSON.stringify(career, null, 2)}
            </pre> */}
          </GridItem>
        ))}
      </GridContainer>
    </Root>
  );
}

type Project = (typeof projects.results)[number];

const ProjectItem = ({ project }: { project: Project }) => {
  const name = project.properties.이름.title?.[0]?.text?.content;
  const description = project.properties.설명.rich_text[0]?.plain_text;

  const onClick = () => {};

  return (
    <article onClick={onClick}>
      <p>{name}</p>
      <p>{description}</p>
    </article>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 16px;
`;

const GridItem = styled.div`
  text-align: center;
  height: 300px;
  border-radius: 16px;
  border-width: 2px;
  border-color: #aaa;
  border
`;
