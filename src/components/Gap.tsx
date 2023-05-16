import React from 'react';
import styled from 'styled-components';

interface GapProps {
  direction?: 'row' | 'column';
  gap: string;
  children: React.ReactNode;
}

const Gap = ({ direction = 'row', gap, children }: GapProps) => {
  return (
    <StyledDiv direction={direction} gap={gap}>
      {children}
    </StyledDiv>
  );
};

const StyledDiv = styled.div<{ direction: 'row' | 'column'; gap: string }>`
  display: flex;
  flex-direction: ${props => props.direction};

  & > * {
    margin-right: ${props => (props.direction === 'row' ? props.gap : '0')};
    margin-bottom: ${props => (props.direction === 'column' ? props.gap : '0')};
  }

  & > *:last-child {
    margin-right: 0;
    margin-bottom: 0;
  }
`;

export default Gap;
