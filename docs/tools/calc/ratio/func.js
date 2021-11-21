import { gcd, lcm } from 'mathjs'

function keydown(e, input_num) {
	if (e.keyCode === 13) check(input_num)
}

function check(input_num) {
	let input_a = document.getElementById('a')
	let input_b = document.getElementById('b')
	let input_c = document.getElementById('c')
	let input_d = document.getElementById('d')
	let integerRatio = document.getElementById('integerRatio')

	let a = parseFloat(input_a.value)
	let b = parseFloat(input_b.value)
	let c = parseFloat(input_c.value)
	let d = parseFloat(input_d.value)

	let filledNum =
		(isEmpty(a) ? 0 : 1) +
		(isEmpty(b) ? 0 : 1) +
		(isEmpty(c) ? 0 : 1) +
		(isEmpty(d) ? 0 : 1)
	if (filledNum >= 3) {
		if (isEmpty(a)) input_a.value = (b * c) / d
		else if (isEmpty(b)) input_b.value = (a * d) / c
		else if (isEmpty(c)) input_c.value = (a * d) / b
		else if (isEmpty(d)) input_d.value = (b * c) / a
		else {
			switch (input_num) {
				case 1:
					input_b.value = calcRatio(c, d, a)
					break
				case 2:
					input_a.value = calcRatio(d, c, b)
					break
				case 3:
					input_d.value = calcRatio(a, b, c)
					break
				case 4:
					input_c.value = calcRatio(b, a, d)
					break
				default:
					break
			}
		}
	}

	let detail = ''

	if (!isEmpty(a) && !isEmpty(b)) {
		const ratio = intRatio(a, b)
		detail += `정수 비 ${ratio[0]} : ${ratio[1]}`
	}

	integerRatio.textContent = detail
}

function calcRatio(a, b, c) {
	return (b * c) / a
}

function intRatio(a, b) {
	const mul = Math.max(multNumToInteger(a), multNumToInteger(b))
	const inta = a * mul
	const intb = b * mul

	const g = gcd(inta, intb)
	return [inta / g, intb / g]
}
function isEmpty(str) {
	return !str || 0 === str.length
}

function multNumToInteger(num) {
	let reg = /\.[0-9]*/g.exec(`${num}`)
	let point = reg ? reg[0].length - 1 : 0
	return Math.pow(10, point)
}

export default { keydown, check, isEmpty, gcd, multNumToInteger }
