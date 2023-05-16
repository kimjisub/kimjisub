import React from 'react';
import { Build } from '@mui/icons-material';
import IconView from '@site/src/components/index/IconView';
import { techs } from '@site/src/db/data/techs';
import { Tech } from '@site/src/db/models/Tech';
import clsx from 'clsx';

import { Title, Title2 } from '../../../../typography';

import styles from './index.module.scss';

export default function Technology() {
  const skillsByType: {
    [type: string]: Tech[];
  } = Object.values(techs).reduce((acc, skill) => {
    if (!acc[skill.type]) {
      acc[skill.type] = [];
    }
    acc[skill.type].push(skill);
    return acc;
  }, {});

  return (
    <div className={clsx(styles.root)}>
      <Title>
        <Build />
        Skills
      </Title>
      <Title2>제가 구사할 수 있는 능력들이에요</Title2>
      <table className={clsx(styles.table)}>
        <tbody>
          {Object.entries(skillsByType).map(([type, skills]) => (
            <tr key={type}>
              <td className={clsx(styles.text)}>{type}</td>
              <td className={clsx(styles.icons)}>
                {skills.map(skill => (
                  <IconView
                    key={skill.name}
                    icon={skill.icon}
                    description={skill.description}
                  />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
