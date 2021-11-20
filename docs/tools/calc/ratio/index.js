import React, { useState } from 'react';
import func from './index.js';

export default function App() {
	return (
		<div className="Calculator-Ratio">
			<input
				type="number"
				step="any"
				id="a"
				onKeyDown={(e) => {
					func.keydown(e, 1);
				}}
				className="input"
			/>
			:
			<input
				type="number"
				step="any"
				id="b"
				onKeyDown={(e) => {
					func.keydown(e, 2);
				}}
				className="input"
			/>
			=
			<input
				type="number"
				step="any"
				id="c"
				onKeyDown={(e) => {
					func.keydown(e, 3);
				}}
				className="input"
			/>
			:
			<input
				type="number"
				step="any"
				id="d"
				onKeyDown={(e) => {
					func.keydown(e, 4);
				}}
				className="input"
			/>
			<br />
			<p id="integerRatio"></p>
		</div>
	);
}
