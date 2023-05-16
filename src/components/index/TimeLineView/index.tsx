import React from 'react';
import { LocalFireDepartment } from '@mui/icons-material';
import clsx from 'clsx';

import { Content, Title, Title2, Year } from '../../../typography';
import { TimeLine } from '../pages/TimeLinePage';

import styles from './index.module.scss';

export interface TimeLineProps {
  list: TimeLine[];
}

export default function TimeLineView({ list }: TimeLineProps) {
  return (
    <div className={clsx(styles.root)}>
      <Title>
        <LocalFireDepartment />
        Career
      </Title>
      <Title2>저는 이러한 길을 걸어왔어요.</Title2>
      <div className={clsx(styles.center)}>
        {list.map((data, i) => (
          <div key={i.toString()} className={clsx(styles.item)}>
            <Year className={clsx(styles.left)}>{data.year}</Year>
            <div className={clsx(styles.divider)}></div>
            <div className={clsx(styles.right)}>
              <Content>{data.title}</Content>
              <Content>{data.content}</Content>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
