import React from 'react';
import Popover from '@mui/material/Popover';
import { SimpleIcon } from 'simple-icons';
import styled from 'styled-components';

import { IconDescription } from '../../typography';

const Root = styled.div``;

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

export default function IconViews({
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
    <Root>
      <Box
        style={{ background: `#${icon.hex}` }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}>
        <Icon role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d={icon.path} style={{ fill: '#fff' }} />
        </Icon>
      </Box>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        <div
          style={{
            width: '200px',
            height: '300px',
          }}>
          <IconDescription>{icon.title}</IconDescription>
          <IconDescription>{description}</IconDescription>
        </div>
      </Popover>
    </Root>
  );
}
