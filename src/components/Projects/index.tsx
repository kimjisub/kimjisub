import React, { useState } from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import IconView from '../../components/IconView'
import { Content, Title, Title2 } from '../../typography'
import { Build } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

export default function Projectes() {
	const [selected, setSelected] = useState(null)

	const items = [
		{
			id: 'UniPad',
			title: 'UniPad',
			subtitle: '리듬게임',
		},
		{
			id: 'asdf',
			title: 'asdf',
			subtitle: 'asdf',
		},
	]

	return (
		<div className={clsx(styles.root)}>
			<Title>
				<Build />
				Projectes
			</Title>
			<Title2>그동안 진행해왔던 프로젝트들이에요.</Title2>
			{items.map((item) => (
				<motion.div layoutId={item.id} onClick={() => setSelected(item)}>
					<motion.h5>{item.subtitle}</motion.h5>
					<motion.h2>{item.title}</motion.h2>
				</motion.div>
			))}
			<AnimatePresence>
				{selected && (
					<motion.div layoutId={selected}>
						<motion.h5>{selected.subtitle}</motion.h5>
						<motion.h2>{selected.title}</motion.h2>
						<motion.button onClick={() => setSelected(null)} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
