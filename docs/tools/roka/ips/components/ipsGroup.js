import React from 'react'
import { TextField, IconButton } from '@material-ui/core'
import dateformat from 'dateformat'
import { Delete } from '@material-ui/icons'

export default function App(props) {
	const { date, ips } = props.data

	return (
		<div className="ipGroup">
			<TextField
				label="날짜"
				value={date}
				placeholder={dateformat(new Date(), 'yyyymmdd')}
				onChange={(e) => {
					const newDate = e.target.value
					props.onChange({ date: newDate, ips })
				}}
			/>
			<TextField
				label={`ips`}
				multiline
				rowsMax={4}
				value={ips.join('\n')}
				variant="outlined"
				onChange={(e) => {
					const newIps = e.target.value.split('\n')
					props.onChange({ date, ips: newIps })
				}}
				helperText={`${ips.filter((ip) => ip.length > 0).length}개`}
			/>
			<IconButton
				onClick={() => {
					props.onDelete()
				}}
			>
				<Delete />
			</IconButton>
		</div>
	)
}
