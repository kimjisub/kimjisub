import React from 'react'
import { TextField, IconButton } from '@mui/material'
import dateformat from 'dateformat'
import { Delete } from '@mui/icons-material'

export default function App(props) {
	const { date, urls } = props.data

	return (
		<div className="URLS_GROUP">
			<TextField
				label="날짜"
				value={date}
				placeholder={dateformat(new Date(), 'yyyymmdd')}
				onChange={(e) => {
					const newDate = e.target.value
					props.onChange({ date: newDate, urls })
				}}
			/>
			<TextField
				label={`urls`}
				multiline
				variant="outlined"
				rows={4}
				value={urls.join('\n')}
				onChange={(e) => {
					const newUrls = e.target.value.split('\n')
					props.onChange({ date, urls: newUrls })
				}}
				helperText={`${urls.filter((ip) => ip.length > 0).length}개`}
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
