import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import IconView from '../../components/IconView'
import { Content, Title, Title2 } from '../../typography'
import { Build } from '@mui/icons-material'

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
							<IconView slug="html5" />
							<IconView slug="css3" />
							<IconView slug="javascript" />
							<IconView slug="typescript" />
							<IconView slug="kotlin" />
							<IconView slug="java" />
							<IconView slug="python" />
							<IconView slug="dart" />
							<IconView slug="cplusplus" />
							<IconView slug="csharp" />
						</td>
					</tr>
					<tr>
						<td className={clsx(styles.text)}>
							<Content>{'Platform & Framework'}</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="android" />
							<IconView slug="nodedotjs" />
							<IconView slug="react" />
							<IconView slug="flutter" />
							<IconView slug="arduino" />
							<IconView slug="raspberrypi" />
							<IconView slug="unity" />
						</td>
					</tr>
					<tr>
						<td className={clsx(styles.text)}>
							<Content>Database</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="mongodb" />
							<IconView slug="mysql" />
							<IconView slug="mariadb" />
							<IconView slug="postgresql" />
							<IconView slug="sqlite" />
							<IconView slug="sequelize" />
						</td>
					</tr>
					<tr>
						<td className={clsx(styles.text)}>
							<Content>{'CI/CD'}</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="github" />
							<IconView slug="git" />
							<IconView slug="githubactions" />
							<IconView slug="docker" />
							<IconView slug="googleplay" />
							<IconView slug="googlecloud" />
							<IconView slug="firebase" />
							<IconView slug="cloudflare" />
							<IconView slug="amazonaws" />
						</td>
					</tr>

					<tr>
						<td className={clsx(styles.text)}>
							<Content>Operate System</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="apple" />
							<IconView slug="windows" />
							<IconView slug="ubuntu" />
							<IconView slug="linux" />
							<IconView slug="synology" />
						</td>
					</tr>
					<tr>
						<td className={clsx(styles.text)}>
							<Content>IDE</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="visualstudiocode" />
							<IconView slug="androidstudio" />
							<IconView slug="xcode" />
							<IconView slug="visualstudio" />
							<IconView slug="anaconda" />
							<IconView slug="jupyter" />
						</td>
					</tr>
					<tr>
						<td className={clsx(styles.text)}>
							<Content>Tools</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="adobephotoshop" />
							<IconView slug="adobeillustrator" />
							<IconView slug="adobepremierepro" />
							<IconView slug="adobeaftereffects" />
							<IconView slug="sketch" />
							<IconView slug="figma" />
							<IconView slug="blender" />
							<IconView slug="abletonlive" />
						</td>
					</tr>
					<tr>
						<td className={clsx(styles.text)}>
							<Content>Social</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="facebook" />
							<IconView slug="instagram" />
							<IconView slug="discord" />
							<IconView slug="slack" />
							<IconView slug="notion" />
						</td>
					</tr>
					<tr>
						<td className={clsx(styles.text)}>
							<Content>Gaming</Content>
						</td>
						<td className={clsx(styles.icons)}>
							<IconView slug="steam" />
							<IconView slug="epicgames" />
							<IconView slug="ubisoft" />
							<IconView slug="oculus" />
							<IconView slug="nintendoswitch" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}
