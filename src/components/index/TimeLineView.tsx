import React from 'react';
import { LocalFireDepartment } from '@mui/icons-material';
import styled from 'styled-components';

import { Content, Title, Title2, Year } from '../../typography';

import { TimeLine } from './pages/TimeLinePage';

export interface TimeLineProps {
  list: TimeLine[];
}

const Root = styled.div`
  max-width: 1000px;
  padding: 5em 0;
`;

const Center = styled.div`
  margin: 0 auto;
  width: fit-content;
`;

const Item = styled.div`
  display: flex;
`;

const Left = styled(Year)`
  min-width: 60px;
  width: 60px;
  text-align: end;
`;

const Right = styled.div`
  padding-bottom: 16px;
`;

const Divider = styled.div`
  margin: 0 30px 0 30px;
  width: 2px;
  background-color: #cdcdcd;

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    margin-top: calc(14px - (14px + 0px * 2) / 2);
    margin-left: calc(2px / 2 - (14px + 0px * 2) / 2);
    background-color: #f8b249;
    border-radius: 14px;
    border: 0px solid #f8b249;
    opacity: 0.25;
    z-index: 0;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 4px;
    height: 4px;
    margin-top: calc(14px - (4px + 2px * 2) / 2);
    margin-left: calc(2px / 2 - (4px + 2px * 2) / 2);
    background-color: #fff;
    border-radius: 4px;
    border: 2px solid #f8b249;
    z-index: 1;
  }
`;

export default function TimeLineView({ list }: TimeLineProps) {
  return (
    <Root>
      <Title>
        <LocalFireDepartment />
        Career
      </Title>
      <Title2>저는 이러한 길을 걸어왔어요.</Title2>
      <Center>
        {list.map((data, i) => (
          <Item key={i.toString()}>
            <Left>{data.year}</Left>
            <Divider></Divider>
            <Right>
              <Content>{data.title}</Content>
              <Content>{data.content}</Content>
            </Right>
          </Item>
        ))}
      </Center>
    </Root>
  );
}
