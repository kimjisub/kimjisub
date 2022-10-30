import { styled } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import 'font-kopub';

export const IntroSubtitleTypo = styled('span')(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: '#8187A8',
  padding: theme.spacing(0),
  // fontFamily: 'KoPub Dotum',
}));

export const IntroTitleTypo = styled('span')(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 700,
  color: '#545971',
  padding: theme.spacing(0),
  lineHeight: '100%',
}));

export const IntroSmallTitleTypo = styled('span')(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 500,
  color: '#545971',
  padding: theme.spacing(1),
}));

// ======================

export const Year = styled('p')(({ theme }) => ({
  fontSize: '1rem',
  color: '#000',
  padding: theme.spacing(0),
}));
export const Content = styled('p')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 400,
  color: '#545971',
  padding: theme.spacing(0),
  margin: 0,
}));
export const Title = styled('p')(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#F68736',
  padding: theme.spacing(0),
  alignItems: 'center',
  margin: 0,
  display: 'flex',
}));
export const Title2 = styled('p')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 700,
  padding: theme.spacing(1),
}));

export const IconDescription = styled('p')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#000',
  padding: theme.spacing(1),
  lineHeight: '100%',
}));
