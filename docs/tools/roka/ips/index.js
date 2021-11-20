import React, { useState } from 'react'
import { IconButton, TextField } from '@material-ui/core'
import { Add, GetApp } from '@material-ui/icons'

import './index.scss'
import IpsGroupView from './components/ipsGroup'

export default function App() {
	const [ipsGroups, setIpsGroups] = useState([
		{
			date: '',
			ips: [],
		},
	])

	function addGroup() {
		setIpsGroups((data) => [
			...data,
			{
				date: '',
				ips: [],
			},
		])
	}

	function download() {
		const result = []

		ipsGroups.forEach((ipsGroup, i) => {
			ipsGroup.ips
				.filter((ip) => ip.length > 0)
				.forEach((ip, i) => {
					result.push(`any,any,${ip},any,any`)
				})
		})

		const element = document.createElement('a')
		const file = new Blob([result.join('\n')], {
			type: 'text/plain;charset=utf-8',
		})
		element.href = URL.createObjectURL(file)
		element.download = `ips.csv`
		document.body.appendChild(element)
		element.click()
		console.log(result.join('\n'))
	}

	return (
		<div className="UTM">
			<div id="option">
				<div id="result">
					<p>결과</p>
					csv로 다운로드
					<IconButton onClick={download}>
						<GetApp />
					</IconButton>
				</div>
			</div>
			<div>
				{ipsGroups.map((item, i) => {
					return (
						<IpsGroupView
							key={i}
							data={item}
							onChange={(data) => {
								setIpsGroups((ipsGroup_) => {
									const ipsGroup = [...ipsGroup_]
									ipsGroup[i] = data
									return ipsGroup
								})
							}}
							onDelete={() => {
								setIpsGroups((ipsGroup_) => {
									const ipsGroup = [...ipsGroup_]
									ipsGroup.splice(i, 1)
									return ipsGroup
								})
							}}
						/>
					)
				})}

				<IconButton onClick={addGroup}>
					<Add />
				</IconButton>
			</div>
		</div>
	)
}
