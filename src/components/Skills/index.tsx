import React from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import IconView from '../IconView';
import { Content, Title, Title2 } from '../../typography';
import { Build } from '@mui/icons-material';
import {
  siAbletonlive,
  siAdobeaftereffects,
  siAdobeillustrator,
  siAdobephotoshop,
  siAdobepremierepro,
  siAmazonaws,
  siAnaconda,
  siAndroid,
  siAndroidstudio,
  siApple,
  siArduino,
  siBlender,
  siCsharp,
  siCplusplus,
  siCloudflare,
  siCss3,
  siDart,
  siDiscord,
  siDocker,
  siEpicgames,
  siFacebook,
  siFigma,
  siFirebase,
  siFlutter,
  siGit,
  siGithub,
  siGithubactions,
  siGooglecloud,
  siGoogleplay,
  siHtml5,
  siInstagram,
  siJavascript,
  siJupyter,
  siKotlin,
  siLinux,
  siMariadb,
  siMarkdown,
  siMidi,
  siMongodb,
  siMysql,
  siNintendoswitch,
  siNodedotjs,
  siNotion,
  siOculus,
  siOpenssl,
  siPostgresql,
  siPython,
  siRaspberrypi,
  siReact,
  siSequelize,
  siSketch,
  siSlack,
  siSocketdotio,
  siSqlite,
  siSteam,
  siSynology,
  siTypescript,
  siUbisoft,
  siUbuntu,
  siUnity,
  siVisualstudio,
  siVisualstudiocode,
  siWindows11,
  siXcode,
} from 'simple-icons/icons';

export default function Skills() {
  return (
    <div className={clsx(styles.root)}>
      <Title>
        <Build />
        Skills
      </Title>
      <Title2>제가 구사할 수 있는 능력들이에요</Title2>
      <table className={clsx(styles.table)}>
        <tbody>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>Language</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siHtml5} description="asdf" />
              <IconView icon={siCss3} />
              <IconView icon={siJavascript} />
              <IconView icon={siTypescript} />
              <IconView icon={siKotlin} />
              <IconView icon={siPython} />
              <IconView icon={siDart} />
              <IconView icon={siCplusplus} />
              <IconView icon={siCsharp} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>Protocol</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siMidi} />
              <IconView icon={siSocketdotio} />
              <IconView icon={siOpenssl} />
              <IconView icon={siMarkdown} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>{'Platform & Framework'}</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siAndroid} />
              <IconView icon={siNodedotjs} />
              <IconView icon={siReact} />
              <IconView icon={siFlutter} />
              <IconView icon={siArduino} />
              <IconView icon={siRaspberrypi} />
              <IconView icon={siUnity} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>Database</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siMongodb} />
              <IconView icon={siMysql} />
              <IconView icon={siMariadb} />
              <IconView icon={siPostgresql} />
              <IconView icon={siSqlite} />
              <IconView icon={siSequelize} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>{'CI/CD'}</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siGithub} />
              <IconView icon={siGit} />
              <IconView icon={siGithubactions} />
              <IconView icon={siDocker} />
              <IconView icon={siGoogleplay} />
              <IconView icon={siGooglecloud} />
              <IconView icon={siFirebase} />
              <IconView icon={siCloudflare} />
              <IconView icon={siAmazonaws} />
            </td>
          </tr>

          <tr>
            <td className={clsx(styles.text)}>
              <Content>Operate System</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siApple} />
              <IconView icon={siWindows11} />
              <IconView icon={siUbuntu} />
              <IconView icon={siLinux} />
              <IconView icon={siSynology} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>IDE</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siVisualstudiocode} />
              <IconView icon={siAndroidstudio} />
              <IconView icon={siXcode} />
              <IconView icon={siVisualstudio} />
              <IconView icon={siAnaconda} />
              <IconView icon={siJupyter} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>Tools</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siAdobephotoshop} />
              <IconView icon={siAdobeillustrator} />
              <IconView icon={siAdobepremierepro} />
              <IconView icon={siAdobeaftereffects} />
              <IconView icon={siSketch} />
              <IconView icon={siFigma} />
              <IconView icon={siBlender} />
              <IconView icon={siAbletonlive} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>Social</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siFacebook} />
              <IconView icon={siInstagram} />
              <IconView icon={siDiscord} />
              <IconView icon={siSlack} />
              <IconView icon={siNotion} />
            </td>
          </tr>
          <tr>
            <td className={clsx(styles.text)}>
              <Content>Gaming</Content>
            </td>
            <td className={clsx(styles.icons)}>
              <IconView icon={siSteam} />
              <IconView icon={siEpicgames} />
              <IconView icon={siUbisoft} />
              <IconView icon={siOculus} />
              <IconView icon={siNintendoswitch} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
