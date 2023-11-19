import React, { useState } from 'react'
import { Tab, Tabs } from '@mui/material'
import './Glossary.scss'
import FingerView from './FingerView'

export default function App(props) {
	const [selectedIndex, setSelectedIndex] = useState(0)

	let list = props.fingerMap.map((item, i) => {
		return (
			<FingerView
				key={i}
				rightHand={props.rightHand}
				actionName={item.actionCodes[selectedIndex]}
				fingerCode={item.fingerCode}
				disabled={!item.actionCodes[selectedIndex]}
			/>
		)
	})

	return (
		<div className="Glossary">
			<Tabs
				value={selectedIndex}
				onChange={(event, newValue) => {
					console.log(event, newValue)
					setSelectedIndex(newValue)
				}}
			>
				<Tab label="1" />
				<Tab label="2" />
				<Tab label="3" />
			</Tabs>
			<div className="list">{list}</div>
		</div>
	)
}
