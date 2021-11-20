import React, { Component } from 'react';
//import { Tabs, Tab } from 'react-bootstrap'
import './Glossary.scss';
import FingerView from './FingerView';

class App extends Component {
	constructor() {
		super();
		this.state = {
			select: 0,
		};
	}
	render() {
		let list = this.props.fingerMap.map((item, i) => {
			return (
				<FingerView
					key={i}
					rightHand={this.props.rightHand}
					actionName={item.actionCodes[this.state.select]}
					fingerCode={item.fingerCode}
					disabled={!item.actionCodes[this.state.select]}
				/>
			);
		});

		return (
			<div className="Glossary">
				{/* <Tabs onSelect={k => this.setState({ select: parseInt(k) - 1 })}>
					<Tab eventKey="1" title="1" />
					<Tab eventKey="2" title="2" />
					<Tab eventKey="3" title="3" />
				</Tabs> */}
				<div className="list">{list}</div>
			</div>
		);
	}
}

export default App;
