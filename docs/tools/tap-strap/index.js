import React, { Component } from 'react'
import './index.scss'
import * as midi from './manager/input/midi'
import * as kpm from './manager/kpm'
import FingerView from './FingerView'
import Glossary from './Glossary'

class App extends Component {
	constructor() {
		super()

		this.state = {
			rightHand: true,
			shift: false,
			keyboardMode: 0,
			showGlossary: true,
			showFingerCode: '',
			showActionCode: '',
			kpm: 0
		}
		this.singleTouchTimerId = -1
		this.pressed = []

		this.doubleTouchTimerId = -1
		this.lastTypeFingerCode = ''
		this.doubleTouchIndex = 0

		this.keyboardMap = {
			a: -4,
			s: -3,
			d: -2,
			f: -1,
			' ': 0,
			j: 1,
			k: 2,
			l: 3,
			';': 4,
			'1': 0,
			'4': 1,
			'8': 2,
			'9': 3,
			'-': 4
		}

		this.fingerMapSystem = [
			{ fingerCode: '345', actionCodes: ['ChangeKeyboard'] },
			{ fingerCode: '123', actionCodes: ['Shift'] }
		]
		this.fingerMaps = [
			[
				{ fingerCode: '1', actionCodes: ['a', 'v', '@'] },
				{ fingerCode: '25', actionCodes: ['b', '[', ']'] },
				{ fingerCode: '1345', actionCodes: ['c', ':', ';'] },
				{ fingerCode: '13', actionCodes: ['d', '&', '$'] },
				{ fingerCode: '2', actionCodes: ['e', '!', '='] },
				{ fingerCode: '124', actionCodes: ['f'] },
				{ fingerCode: '134', actionCodes: ['g', '<', '>'] },
				{ fingerCode: '2345', actionCodes: ['h', '-'] },
				{ fingerCode: '3', actionCodes: ['i', 'j'] },
				{ fingerCode: '1235', actionCodes: ['j'] },
				{ fingerCode: '14', actionCodes: ['k', '?', '*'] },
				{ fingerCode: '34', actionCodes: ['l', '/', '+'] },
				{ fingerCode: '24', actionCodes: ['m', ','] },
				{ fingerCode: '12', actionCodes: ['n'] },
				{ fingerCode: '4', actionCodes: ['o', 'q'] },
				{ fingerCode: '125', actionCodes: ['p', '(', ')'] },
				{ fingerCode: '235', actionCodes: ['q'] },
				{ fingerCode: '1234', actionCodes: ['r', "'", '%'] },
				{ fingerCode: '45', actionCodes: ['s'] },
				{ fingerCode: '23', actionCodes: ['t', '"', '#'] },
				{ fingerCode: '5', actionCodes: ['u', 'w', '_'] },
				{ fingerCode: '1245', actionCodes: ['v'] },
				{ fingerCode: '135', actionCodes: ['w'] },
				{ fingerCode: '245', actionCodes: ['x'] },
				{ fingerCode: '15', actionCodes: ['y', 'z'] },
				{ fingerCode: '35', actionCodes: ['z'] },
				{ fingerCode: '12345', actionCodes: ['Space', '.'] },
				{ fingerCode: '234', actionCodes: ['BackSpace'] },
				{ fingerCode: '145', actionCodes: ['Enter'] }
			],
			[
				{ fingerCode: '2345', actionCodes: ['0'] },
				{ fingerCode: '1', actionCodes: ['1'] },
				{ fingerCode: '2', actionCodes: ['2'] },
				{ fingerCode: '3', actionCodes: ['3'] },
				{ fingerCode: '4', actionCodes: ['4'] },
				{ fingerCode: '5', actionCodes: ['5'] },
				{ fingerCode: '15', actionCodes: ['6'] },
				{ fingerCode: '25', actionCodes: ['7'] },
				{ fingerCode: '35', actionCodes: ['8'] },
				{ fingerCode: '45', actionCodes: ['9'] }
			]
		]

		midi.setOnFingerTouch(fingerNumber => {
			this.fingerTouch(fingerNumber)
		})
		midi.initMidi()
	}

	onKeyEvent(e) {
		//console.log(e.type, e)
		if (e.key === 'F5') return
		e.preventDefault()
		if (!e.repeat) {
			if (e.type === 'keydown') {
				let fingerNumber = this.keyboardMap[e.key]
				this.fingerTouch(fingerNumber)
			}
		}
	}
	fingerTouch(fingerNumber) {
		if (fingerNumber !== undefined) {
			if (fingerNumber > 0 && !this.state.rightHand) this.setState({ rightHand: true })
			if (fingerNumber < 0 && this.state.rightHand) this.setState({ rightHand: false })
			let fingerCodeNumber = Math.abs(fingerNumber) + 1
			if (!this.pressed.includes(fingerCodeNumber)) this.pressed.push(fingerCodeNumber)
		}
		clearTimeout(this.singleTouchTimerId)
		this.singleTouchTimerId = setTimeout(() => this.recognized(), 100)
	}
	recognized() {
		if (this.pressed.length > 0) {
			this.pressed.sort()
			let fingerCode = ''
			for (let i in this.pressed) fingerCode += this.pressed[i]
			//console.log(fingerCode)
			this.type(fingerCode)
		}
	}

	clearDoubleTouch() {
		this.lastTypeFingerCode = ''
		this.doubleTouchIndex = 0
	}

	type(fingerCode) {
		this.setState({ kpm: kpm.type() })

		let actionCodes = '?'
		if (this.fingerMapSystem.find(item => item.fingerCode === fingerCode)) {
			//시스템 키인 경우
			actionCodes = this.fingerMapSystem.find(item => item.fingerCode === fingerCode).actionCodes
		} else {
			//키보드 키인 경우
			actionCodes = this.fingerMaps[this.state.keyboardMode].find(item => item.fingerCode === fingerCode)?.actionCodes || ['?']
		}
		// 이전 키와 다른 경우 더블터치 프로세스 초기화
		if (this.lastTypeFingerCode !== fingerCode) this.clearDoubleTouch()

		//더블터치인 경우 이전에 작성한 문자 지우기
		if (this.doubleTouchIndex > 0) this.typeBackspace()

		// 더블터치된 값 가져오기
		let actionCode = actionCodes[this.doubleTouchIndex]

		this.lastTypeFingerCode = fingerCode
		this.doubleTouchIndex++

		this.setState({ showFingerCode: fingerCode, showActionCode: actionCode })

		switch (actionCode) {
			case 'Space':
				this.typeChar(' ')
				break
			case 'BackSpace':
				this.typeBackspace()
				break
			case 'Enter':
				this.typeChar('\n')
				break
			case 'Shift':
				this.setState({ shift: !this.state.shift })
				break
			case 'ChangeKeyboard':
				this.setState({ keyboardMode: (this.state.keyboardMode + 1) % this.fingerMaps.length })
				break
			case undefined:
				break
			default:
				let keyCode = this.state.shift ? actionCode.toUpperCase() : actionCode
				this.typeChar(keyCode)
				//let event = new KeyboardEvent('keypress', { key: 't', code: 'KeyT', keyCode: 116, charCode: 116, bubbles: true, cancelable: true, composed: true })
				//event.isTrusted = true
				//document.getElementById('textarea').dispatchEvent(event)
				break
		}

		this.pressed = []

		clearTimeout(this.doubleTouchTimerId)
		this.doubleTouchTimerId = setTimeout(() => this.clearDoubleTouch(), actionCodes.length > this.doubleTouchIndex ? 200 : 1)
	}

	typeBackspace() {
		document.getElementById('textarea').value = document.getElementById('textarea').value.slice(0, document.getElementById('textarea').value.length - 1)
	}
	typeChar(c) {
		document.getElementById('textarea').value += c
	}
	render() {
		return (
			<div className="Practice-Tap">
				<div className="explanation">
					<p>왼손: asdf_ 오른손: _jkl; (_는 띄어쓰기)</p>
					<p>연습하고 싶은 손의 검지손가락을 키보드의 돌기에 자연스럽게 올려놓아주세요.</p>
					<p>다중키 입력이 되지 않는 키보드는 사용이 불가능합니다.</p>
					<p>아래 표를 참고하여 연습해주세요. 왼손 오른손 모드는 자동으로 바뀝니다.</p>
				</div>

				<div className="wrap-textarea">
					<span>CapsLock: {this.state.shift ? 'On' : 'Off'}</span>
					<span>{this.state.rightHand ? 'Right' : 'Left'}Hand Mode </span>
					<span>{this.state.kpm} key/m</span>
					<br />
					<textarea type="text" id="textarea" autoFocus />
				</div>

				<div className="fingerView">
					<FingerView rightHand={this.state.rightHand} actionName={this.state.showActionCode} fingerCode={this.state.showFingerCode}></FingerView>
				</div>

				<div className="glossary">
					<Glossary rightHand={this.state.rightHand} fingerMap={this.fingerMaps[this.state.keyboardMode].concat(this.fingerMapSystem)} />
				</div>
			</div>
		)
	}

	componentDidMount() {
		document.getElementById('textarea').addEventListener('keydown', e => this.onKeyEvent(e), false)
		//document.getElementById('textarea').addEventListener('keypress', e => this.onKeyEvent(e), false)
		//document.getElementById('textarea').addEventListener('keyup', e => this.onKeyEvent(e), false)
	}
	componentWillUnmount() {
		document.getElementById('textarea').removeEventListener('keydown', e => this.onKeyEvent(e), false)
		//document.getElementById('textarea').removeEventListener('keypress', e => this.onKeyEvent(e), false)
		//document.getElementById('textarea').removeEventListener('keyup', e => this.onKeyEvent(e), false)
	}
}

export default App
