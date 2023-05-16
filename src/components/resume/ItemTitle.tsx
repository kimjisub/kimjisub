import React from 'react';
import styled from 'styled-components';

interface ItemTitleProps {
  title: string;
  subtitle: string;
}

const ItemTitle = ({ title, subtitle }: ItemTitleProps) => {
  return (
    <Root>
      <Title>{title}</Title>
      <SubTitle>{subtitle}</SubTitle>
    </Root>
  );
};

const Root = styled.p`
  margin-bottom: 3px;
`;

const Title = styled.span`
  font-size: 1.5em;
`;

const SubTitle = styled.span`
  margin-left: 0.5em;
  font-size: 1em;
  color: #949494;
`;

export default ItemTitle;
