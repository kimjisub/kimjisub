import React from 'react'
import clsx from 'clsx'
import styles from './TimeLine.module.scss'
import { styled, Typography } from '@mui/material'

const Year = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	fontSize: '18px',
	color: '#000',
	padding: theme.spacing(1),
}))
const Title = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	fontSize: '18px',
	color: '#000',
	padding: theme.spacing(1),
}))
const Content = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	fontSize: '14px',
	fontWeight: 500,
	color: '#aaa',
	padding: theme.spacing(1),
}))

export default function TimeLine({ list }) {
	console.log('hi', styles)
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
