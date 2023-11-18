import React from 'react';
import { Build } from '@mui/icons-material';
import IconView from '@site/src/components/index/IconView';
import techs from '@site/src/db/data/techs.json';
import { Title, Title2 } from '@site/src/typography';
import styled from 'styled-components';

const Root = styled.div`
  max-width: 1000px;
  padding: 5em 0;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 50px);
  grid-gap: 16px;
`;

const GridItem = styled.div`
  text-align: center;
`;

export default function Technology() {
  return (
    <Root>
      <Title>
        <Build />
        Skills
      </Title>
      <Title2>제가 구사할 수 있는 능력들이에요</Title2>

      <GridContainer>
        {techs.results.map(tech => {
          const title =
            tech.properties['환경 및 기술'].title?.[0]?.text?.content;
          const iconSlug = tech.properties.iconSlug.rich_text[0]?.plain_text;
          return (
            <GridItem key={title}>
              <IconView
                title={title}
                iconSlug={iconSlug} // description={skill.description}
              />
            </GridItem>
          );
        })}
      </GridContainer>
    </Root>
  );
}
