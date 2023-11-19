import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { gcd, add, bignumber, divide, multiply } from 'mathjs'

function calcRatio(a, b, c) {
	const bigA = bignumber(a)
	const bigB = bignumber(b)
	const bigC = bignumber(c)
	return divide(multiply(b, c), a)
}

function intRatio(a, b) {
	const mul = Math.max(multNumToInteger(a), multNumToInteger(b))
	const inta = a * mul
	const intb = b * mul

	const g = gcd(inta, intb)
	return [inta / g || 0, intb / g || 0]
}

function multNumToInteger(num) {
	let reg = /\.[0-9]*/g.exec(`${num}`)
	let point = reg ? reg[0].length - 1 : 0
	return Math.pow(10, point)
}

export default function App() {
	const [a, setA] = useState(0)
	const [b, setB] = useState(0)
	const [c, setC] = useState(0)
	const [d, setD] = useState(0)
	const [lastChange, setLastChange] = useState('c')

	console.log(a, b, c, d)
	const intRatioResult = intRatio(a, b)
	return (
		<div className="Calculator-Ratio">
			<TextField
				id="outlined-number"
				label="A"
				type="number"
				size="small"
				value={a.toString()}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={(e) => {
					const a = e.target.valueAsNumber || 0
					setA(a)
					switch (lastChange) {
						case 'c':
							setD(calcRatio(a, b, c))
							break
						case 'd':
							setC(calcRatio(b, a, d))
							break
					}
				}}
			/>
			:
			<TextField
				id="outlined-number"
				label="B"
				type="number"
				size="small"
				value={b.toString()}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={(e) => {
					const b = e.target.valueAsNumber || 0
					setB(b)
					switch (lastChange) {
						case 'c':
							setD(calcRatio(a, b, c))
							break
						case 'd':
							setC(calcRatio(b, a, d))
							break
					}
				}}
			/>
			<br />
			<br />
			<TextField
				id="outlined-number"
				label="C"
				type="number"
				size="small"
				value={c.toString()}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={(e) => {
					const c = e.target.valueAsNumber || 0
					setC(c)
					setLastChange('c')
					setD(calcRatio(a, b, c))
				}}
			/>
			:
			<TextField
				id="outlined-number"
				label="D"
				type="number"
				size="small"
				value={d.toString()}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={(e) => {
					const d = e.target.valueAsNumber || 0
					setD(d)
					setLastChange('d')
					setC(calcRatio(b, a, d))
				}}
			/>
			<br />
			<br />
			<TextField
				id="outlined-number"
				label="Int A"
				type="number"
				size="small"
				value={intRatioResult[0]}
				InputLabelProps={{
					shrink: true,
				}}
				disabled
				onChange={(e) => {}}
			/>
			:
			<TextField
				id="outlined-number"
				label="Int B"
				type="number"
				size="small"
				value={intRatioResult[1]}
				InputLabelProps={{
					shrink: true,
				}}
				disabled
				onChange={(e) => {}}
			/>
		</div>
	)
}
