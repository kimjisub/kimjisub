import React, { useState } from 'react'
import { IconButton, TextField } from '@material-ui/core'
import { Add, GetApp } from '@material-ui/icons'

import './index.scss'
import UrlsView from './components/urlsGroup'

export default function App() {
	const [groupName, setGroupName] = useState('주간차단-url')
	const [urlsGroups, setUrlsGroups] = useState([
		{
			date: '',
			urls: [],
		},
	])

	function addGroup() {
		setUrlsGroups((data) => [
			...data,
			{
				date: '',
				urls: [],
			},
		])
	}

	function download() {
		const result = ['NAME,INCLUSION,WHITE IP,GROUP DESC,URL,DESC']

		let count = 0
		urlsGroups.forEach((urlsGroup, i) => {
			urlsGroup.urls
				.filter((url) => url.length > 0)
				.forEach((url, i) => {
					result.push(
						`${count === 0 ? groupName : ''},>,,,${url},유해사이트_${
							urlsGroup.date
						}`
					)

					count++
				})
		})

		const element = document.createElement('a')
		const file = new Blob([result.join('\n')], {
			type: 'text/plaincharset=utf-8',
		})
		element.href = URL.createObjectURL(file)
		element.download = 'urls.csv'
		document.body.appendChild(element)
		element.click()
		console.log(result.join('\n'))
	}

	return (
		<div className="URL">
			<div id="option">
				<div id="setting">
					<p>설정</p>
					<TextField
						label="그룹 이름"
						onChange={(e) => {
							setGroupName(e.target.value)
						}}
						defaultValue={groupName}
					/>
				</div>
				<div id="result">
					<p>결과</p>
					csv로 다운로드
					<IconButton onClick={download}>
						<GetApp />
					</IconButton>
				</div>
			</div>
			<div>
				{urlsGroups.map((item, i) => {
					return (
						<UrlsView
							key={i}
							data={item}
							onChange={(data) => {
								setUrlsGroups((urlsGroup_) => {
									const urlsGroup = [...urlsGroup_]
									urlsGroup[i] = data
									return urlsGroup
								})
							}}
							onDelete={() => {
								setUrlsGroups((urlsGroup_) => {
									const urlsGroup = [...urlsGroup_]
									urlsGroup.splice(i, 1)
									return urlsGroup
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
