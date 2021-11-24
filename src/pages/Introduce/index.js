import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import { Typography } from '@mui/material'
import Link from '@docusaurus/Link'

export default function Introduce() {
	return (
		<div
			className={clsx(
				'hero ',
				styles.root,
				styles.heroBanner,
				styles.fullheight
			)}
		>
			<div className="container">
				<div className="hero__subtitle">
					<Typography variant="subtitle1" gutterBottom component="span">
						Developer
					</Typography>
					<br />
					<Typography variant="h2" component="span" gutterBottom>
						김지섭
					</Typography>
					<Typography variant="body1" component="span" gutterBottom>
						을 소개할게요
					</Typography>
				</div>
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
	)
}
