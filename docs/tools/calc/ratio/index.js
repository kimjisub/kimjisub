import React, { useState } from 'react'
import func from './func.js'
import { TextField } from '@mui/material'
import { gcd, lcm } from 'mathjs'

export default function App() {
	const [a, setA] = useState(0)
	const [b, setB] = useState(0)
	const [c, setC] = useState(0)
	const [d, setD] = useState(0)
	const [intRatio, setIntRatio] = useState('')

	//console.log(lcm(1, 1.1))
	return (
		<div className="Calculator-Ratio">
			<TextField
				id="outlined-number"
				label="A"
				type="number"
				defaultValue={a}
				InputLabelProps={{
					shrink: true,
				}}
				onKeyDown={(e) => {
					if (e.code == 'Enter') fun.check(input_num)
				}}
			/>
			:
			<TextField
				id="outlined-number"
				label="B"
				type="number"
				defaultValue={b}
				InputLabelProps={{
					shrink: true,
				}}
			/>
			=
			<TextField
				id="outlined-number"
				label="C"
				type="number"
				defaultValue={c}
				InputLabelProps={{
					shrink: true,
				}}
			/>
			:
			<TextField
				id="outlined-number"
				label="D"
				type="number"
				defaultValue={d}
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<br />
			<input
				type="number"
				step="any"
				id="a"
				onKeyDown={(e) => {
					func.keydown(e, 1)
				}}
				className="input"
			/>
			:
			<input
				type="number"
				step="any"
				id="b"
				onKeyDown={(e) => {
					func.keydown(e, 2)
				}}
				className="input"
			/>
			=
			<input
				type="number"
				step="any"
				id="c"
				onKeyDown={(e) => {
					func.keydown(e, 3)
				}}
				className="input"
			/>
			:
			<input
				type="number"
				step="any"
				id="d"
				onKeyDown={(e) => {
					func.keydown(e, 4)
				}}
				className="input"
			/>
			<br />
			<p id="integerRatio"></p>
		</div>
	)
}
