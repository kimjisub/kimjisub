import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import Link from '@docusaurus/Link'

import {
	IntroSubtitleTypo,
	IntroTitleTypo,
	IntroSmallTitleTypo,
	Content,
} from '../../typography'

export default function Introduce() {
	return (
		<div
			className={clsx(
				'hero',
				styles.root,
				styles.heroBanner,
				styles.fullheight
			)}
		>
			<div className="container">
				<div className="hero__subtitle">
					<div className={clsx(styles.decorations)}>
						<div className={clsx(styles.decoration1)}></div>
					</div>
					<p>
						<IntroSubtitleTypo>Developer</IntroSubtitleTypo>
						<br />
						<IntroTitleTypo>김지섭</IntroTitleTypo>
						<IntroSmallTitleTypo>을 소개할게요</IntroSmallTitleTypo>
					</p>
					<p>
						<Content>
							안드로이드 개발을 주력으로 하고 있으며 다양한 프로젝트에서
							<br />웹 백엔드와 프론트엔드 파트를 맡아본 경험이 있는 풀스택 지망
							개발자에요.
						</Content>
					</p>
					<div className={styles.buttons}>
						<Link
							className="button button--secondary button--lg"
							to="/docs/intro"
						>
							포트폴리오
						</Link>

						<Link
							className="button button--secondary button--lg"
							to="/docs/intro"
						>
							블로그
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
