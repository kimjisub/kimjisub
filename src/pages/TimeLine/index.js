import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import { Year, Title, Title2, Content } from '../../typography'
import { LocalFireDepartment } from '@mui/icons-material'

export default function TimeLine({ list }) {
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
	)
}
