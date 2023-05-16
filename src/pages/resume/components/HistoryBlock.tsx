import Gap from '@site/src/components/Gap';
import React from 'react';
import styled from 'styled-components';

export interface History {
  title: React.ReactNode;
  date?: React.ReactNode;
  list: React.ReactNode[];
}

export interface HistoryBlockProps {
  history: History;
}

const HistoryBlock = ({ history }: HistoryBlockProps) => {
  return (
    <Root className="text-2xl font-semibold">
      <Gap gap="8px">
        <ItemHeader>
          <Role>{history.title}</Role>
          <Description>{history.date}</Description>
        </ItemHeader>
        <ul>
          {history.list.map((list, index) => (
            <li key={index}>{list}</li>
          ))}
        </ul>
      </Gap>
    </Root>
  );
};

const Root = styled.div`
  margin-bottom: 10mm;
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

export default HistoryBlock;
