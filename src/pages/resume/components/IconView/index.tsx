import React from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import { SimpleIcon } from 'simple-icons';
import styled from 'styled-components';

export default function IconView({
  icon,
  description,
}: {
  icon: SimpleIcon;
  description?: string;
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Root
      className={clsx(styles.box)}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(styles.icon)}>
        <path d={icon.path} style={{ fill: '#fff' }} />
      </svg>
    </Root>
  );
}

const Root = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
