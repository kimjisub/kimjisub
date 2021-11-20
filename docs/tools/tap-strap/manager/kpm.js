let typeTimeList = []
let recognitionTime = 5000
let prevTime

export function type() {
	let currTime = new Date().getTime()
	let diff = currTime - prevTime
	if (diff < recognitionTime)
		typeTimeList.push(diff)

	let avgDelay = avg(typeTimeList)
	let kpm = (60000 / avgDelay).toFixed(2)
	prevTime = currTime
	// eslint-disable-next-line
	return kpm != Infinity ? kpm : 0
}

function avg(arr) {
	let sum = 0
	for (let i in arr)
		sum += arr[i]
	return sum / arr.length
}