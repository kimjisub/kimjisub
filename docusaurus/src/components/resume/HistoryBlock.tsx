import React, { ComponentType, SVGProps } from 'react';
import Gap from '@site/src/components/Gap';
import styled from 'styled-components';

export interface HistoryIcon {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  name: string;
  url: string;
}

export interface History {
  title: React.ReactNode;
  date?: React.ReactNode;
  list: React.ReactNode[];
  urls?: HistoryIcon[];
}

export interface HistoryBlockProps {
  history: History;
}

const HistoryBlock = ({ history }: HistoryBlockProps) => {
  return (
    <Root className="text-2xl font-semibold">
      <Gap gap="1em">
        <ItemHeader>
          <Role>{history.title}</Role>
          <Description>{history.date}</Description>
          <p
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            {history.urls?.map((historyIcon, index) => {
              const { icon: Icon, url } = historyIcon;
              return (
                <A key={index} href={url}>
                  <Icon width={30} height={30} key={index}></Icon>
                </A>
              );
            })}
          </p>
        </ItemHeader>
        <List>
          {history.list.map((list, index) => (
            <ListItem key={index}>{list}</ListItem>
          ))}
        </List>
      </Gap>
    </Root>
  );
};

const Root = styled.div`
  margin-bottom: 3em;
`;

const ItemHeader = styled.div`
  width: 10em;
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

const List = styled.ul`
  flex: 1;
`;

const ListItem = styled.li`
  word-wrap: break-word;
`;

const A = styled.a`
  cursor: pointer;
`;

export default HistoryBlock;
