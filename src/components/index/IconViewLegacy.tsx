import React from 'react';
import { SimpleIcon } from 'simple-icons';
import styled from 'styled-components';

const Root = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.1);
    transition: all 0.1s ease-in-out;
  }
`;

const Icon = styled.svg`
  width: 30px;
  height: 30px;
`;

export default function IconViewLegacy({
  icon,
  description,
}: {
  icon: SimpleIcon;
  description?: string;
}) {
  return (
    <Root>
      <Icon
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ background: `#${icon.hex}` }}>
        <path d={icon.path} style={{ fill: '#fff' }} />
      </Icon>
    </Root>
  );
}
