import React from 'react';
import styled from 'styled-components';

import HistoryBlock, { History } from './HistoryBlock';

export interface ExperienceViewProp {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  histories: History[];
}

const ExperienceView = ({ title, subtitle, histories }: ExperienceViewProp) => {
  return (
    <Root className="text-2xl font-semibold">
      <ExperienceHeader>
        <Title>{title}</Title>
        <Description>{subtitle}</Description>
      </ExperienceHeader>
      {histories.map((history, index) => (
        <div key={index}>
          <HistoryBlock history={history} />
        </div>
      ))}
    </Root>
  );
};

const Root = styled.div`
  margin-bottom: 3px;
`;

const ExperienceHeader = styled.div`
  margin-bottom: 8px;
`;

const Title = styled.p`
  font-size: 1.25em;
  margin: 0;
`;

const Description = styled.p`
  margin-left: 0.5em;
  font-size: 1em;
  margin: 0;
  color: #949494;
`;

export default ExperienceView;
