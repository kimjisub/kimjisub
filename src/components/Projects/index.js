import React, { useState } from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import IconView from '../../components/IconView'
import { Content, Title, Title2 } from '../../typography'
import { Build } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

export default function Projectes() {
	const [selectedId, setSelectedId] = useState(null)

	const items = [
		{
			id: 'UniPad',
			title: 'UniPad',
			subtitle: '리듬게임',
		},
	]

	return (
		<div className={clsx(styles.root)}>
			<Title>
				<Build />
				Projectes
			</Title>
			<Title2>그동안 진행해왔던 프로젝트들이에요.</Title2>
			{/* {items.map((item) => (
				<motion.div layoutId={item.id} onClick={() => setSelectedId(item.id)}>
					<motion.h5>{item.subtitle}</motion.h5>
					<motion.h2>{item.title}</motion.h2>
				</motion.div>
			))}
			<AnimatePresence>
				{selectedId && (
					<motion.div layoutId={selectedId}>
						<motion.h5>{item.subtitle}</motion.h5>
						<motion.h2>{item.title}</motion.h2>
						<motion.button onClick={() => setSelectedId(null)} />
					</motion.div>
				)}
			</AnimatePresence> */}
		</div>
	)
}
