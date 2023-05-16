import React, { CSSProperties } from 'react';
import styled from 'styled-components';

interface PageProps {
  children: React.ReactNode;
}

const Page = ({ children }: PageProps) => {
  return <A4>{children}</A4>;
};

const A4 = styled.div`
  font-size: 3.5mm;
  width: 210mm;
  aspect-ratio: 1 / 1.414;
  overflow: hidden;
  background: white;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  page-break-after: always;
  padding: 50px;
  margin: 50px 0;
  @media print {
    width: 210mm;
    box-shadow: none;
    margin: 0;
  }
  @page {
    size: auto;
    margin: 0mm;
  }
`;

export default Page;
