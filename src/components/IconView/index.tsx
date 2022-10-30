import React from 'react'
import clsx from 'clsx'
import styles from './index.module.scss'
import Popover from '@mui/material/Popover'
import { IconDescription } from '../../typography'
import { SimpleIcon } from 'simple-icons'

export default function IconView({
	icon,
	description,
}: {
	icon: SimpleIcon
	description?: string
}) {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setAnchorEl(null)
	}

	return (
		<div className={clsx(styles.root)}>
			<div
				className={clsx(styles.box)}
				style={{ background: `#${icon.hex}` }}
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
			>
				<svg
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					className={clsx(styles.icon)}
				>
					<path d={icon.path} style={{ fill: '#fff' }} />
				</svg>
			</div>
			<Popover
				id="mouse-over-popover"
				sx={{
					pointerEvents: 'none',
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<IconDescription>{icon.title}</IconDescription>
				<IconDescription>{description}</IconDescription>
			</Popover>
		</div>
	)
}
