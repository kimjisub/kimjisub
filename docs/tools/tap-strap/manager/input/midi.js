let inputs = {}
let outputs = {}
let defaultMIDI = 'MIDIOUT2 (LPX MIDI)'

let midiMap = {
	LPX: {
		14: 0,
		25: 1,
		26: 2,
		27: 3,
		28: 4,
		15: 0,
		24: -1,
		23: -2,
		22: -3,
		21: -4,
		74: 0,
		85: 1,
		86: 2,
		87: 3,
		88: 4,
		75: 0,
		84: -1,
		83: -2,
		82: -3,
		81: -4
	}
}

let selectedDevice = 'LPX'

export function initMidi() {
	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess({ sysex: false }).then(onMIDISuccess, onMIDIFailure)
	} else {
		alert('No MIDI support in your browser.')
	}
}

// midi functions
function onMIDISuccess(midiAccess) {
	for (let input of midiAccess.inputs.values()) {
		inputs[input.name] = input
		input.onmidimessage = onMidiMessage
		console.log(`Input port\n`, `id: ${input.id}\n`, `manufacturer: ${input.manufacturer}\n`, `name: ${input.name}\n`)
	}
	for (let output of midiAccess.outputs.values()) {
		outputs[output.name] = output
		console.log(`Output port\n`, `id: ${output.id}\n`, `manufacturer: ${output.manufacturer}\n`, `name: ${output.name}\n`)
	}
}

function onMIDIFailure(e) {
	console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e)
}

function onMidiMessage(message) {
	//let id = message.currentTarget.id
	let name = message.currentTarget.name
	let data = message.data
	console.log(`MIDI input [${name}]`, data)
	led(data)

	let note = data[1]
	let velocity = data[2]

	if (midiMap[selectedDevice] && velocity !== 0) onFingerTouch(midiMap[selectedDevice][note])
}

let onFingerTouch = () => {}
export function setOnFingerTouch(func) {
	onFingerTouch = func
}

function led(data) {
	if (outputs[defaultMIDI]) {
		//console.log(`MIDI output [${defaultMIDI}]`, data)
		outputs[defaultMIDI].send(data)
	}
}
