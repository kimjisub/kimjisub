import Gap from '@site/src/components/Gap';
import React from 'react';
import styled from 'styled-components';

interface Item {
  role: React.ReactNode;
  date?: React.ReactNode;
  list: React.ReactNode[];
}

interface ItemProps {
  item: Item;
}

export interface ExperienceViewProp {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  items: Item[];
}

export const ItemView = ({ item }: ItemProps) => {
  return (
    <Root className="text-2xl font-semibold">
      <Gap gap="8px">
        <ItemHeader>
          <Role>{item.role}</Role>
          <Description>{item.date}</Description>
        </ItemHeader>
        <ul>
          {item.list.map((list, index) => (
            <li key={index}>{list}</li>
          ))}
        </ul>
      </Gap>
    </Root>
  );
};

const ExperienceView = ({ title, subtitle, items }: ExperienceViewProp) => {
  return (
    <Root className="text-2xl font-semibold">
      <ExperienceHeader>
        <Title>{title}</Title>
        <Description>{subtitle}</Description>
      </ExperienceHeader>
      {items.map((item, index) => (
        <div key={index}>
          <ItemView item={item} />
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

const ItemHeader = styled.div`
  width: 40mm;
`;

const Role = styled.p`
  font-size: 1em;
  margin: 0;
`;

const Description = styled.p`
  margin-left: 0.5em;
  font-size: 1em;
  margin: 0;
  color: #949494;
`;

export default ExperienceView;
