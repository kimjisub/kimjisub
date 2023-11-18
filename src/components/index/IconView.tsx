import React from 'react';
import * as icons from 'simple-icons';
import { SimpleIcon } from 'simple-icons';
import styled from 'styled-components';

const Box = styled.div`
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

export default function IconView({
  iconSlug,
}: {
  iconSlug: string;
  title: string;
  description?: string;
}) {
  const icon =
    iconSlug &&
    (icons?.[
      `si${iconSlug.charAt(0).toUpperCase() + iconSlug.slice(1)}`
    ] as SimpleIcon | null);

  return (
    <article>
      <Box style={{ background: `#${icon?.hex ?? 'fff'}` }}>
        {/* <img
          height="24"
          width="24"
          src={`https://cdn.simpleicons.org/${iconSlug}/_/gray`}
        /> */}
        {icon && (
          <Icon
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d={icon.path} style={{ fill: '#fff' }} />
          </Icon>
        )}
      </Box>
    </article>
  );
}
