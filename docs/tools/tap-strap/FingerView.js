import React, { Component } from 'react'
import './FingerView.scss'

class App extends Component {
	constructor() {
		super()
		this.state = {
			addName: ''
		}
	}

	render() {
		let finger = [false, false, false, false, false]
		for (let i in this.props.fingerCode) finger[this.props.fingerCode[i] - 1] = true
		if (!this.props.rightHand) finger.reverse()

		return (
			<div className={'FingerView' + (this.props.disabled ? ' disabled' : '')}>
				<p className="actionName">{this.props.actionName || ' '}</p>

				{finger.map((bool, i) => {
					return <p key={i} className={'dot ' + (bool ? 'check' : '')} />
				})}
			</div>
		)
	}
}

export default App
