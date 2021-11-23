import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import { Year, Title, Content } from '../../typography'

export default function TimeLine({ list }) {
	return (
		<div className={clsx(styles.root)}>
			{list.map((data, i) => (
				<div key={i.toString()} className={clsx(styles.item)}>
					<Year className={clsx(styles.left)}>{data.year}</Year>
					<div className={clsx(styles.divider)}></div>
					<div className={clsx(styles.right)}>
						<Title>{data.title}</Title>
						<Content>{data.content}</Content>
					</div>
				</div>
			))}
		</div>
	)
}
