import React from 'react';
import { Build } from '@mui/icons-material';
import IconView from '@site/src/components/index/IconView';
import { techs } from '@site/src/db/data/techs';
import { Tech } from '@site/src/db/models/Tech';
import { Title, Title2 } from '@site/src/typography';
import styled from 'styled-components';

const Root = styled.div`
  max-width: 1000px;
  padding: 5em 0;
  margin: 0 auto;
`;

const Text = styled.td`
  text-align: end;
  align-self: center;
  padding: 0;
  padding-right: 10px;
`;

const Icons = styled.td`
  > * {
    float: left;
    margin: 10px;
  }
  padding: 0;
`;

const Table = styled.table`
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
`;

export default function Technology() {
  const skillsByType: {
    [type: string]: Tech[];
  } = Object.values(techs).reduce((acc, skill) => {
    if (!acc[skill.type]) {
      acc[skill.type] = [];
    }
    acc[skill.type].push(skill);
    return acc;
  }, {});

  return (
    <Root>
      <Title>
        <Build />
        Skills
      </Title>
      <Title2>제가 구사할 수 있는 능력들이에요</Title2>
      <Table>
        <tbody>
          {Object.entries(skillsByType).map(([type, skills]) => (
            <tr key={type}>
              <Text>{type}</Text>
              <Icons>
                {skills.map(skill => (
                  <IconView
                    key={skill.name}
                    icon={skill.icon}
                    description={skill.description}
                  />
                ))}
              </Icons>
            </tr>
          ))}
        </tbody>
      </Table>
    </Root>
  );
}
