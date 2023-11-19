import React from 'react';
import styled from 'styled-components';

interface PageProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Page = ({ children, style }: PageProps) => {
  return <A4 style={style}>{children}</A4>;
};

const A4 = styled.div`
  font-size: 3.45mm;
  background: white;
  padding: 4em;

  @media screen {
    width: 210mm;
    aspect-ratio: 1 / 1.414;
    overflow: hidden;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    margin: 24px 0;
  }

  @media print {
    &:not(:last-child) {
      page-break-after: always;
    }
    margin: 0;
    box-shadow: none;
  }
  @page {
    size: auto;
    margin: 0;
  }
`;

export default Page;
