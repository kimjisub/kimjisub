function keydown(e, input_num) {
	if (e.keyCode === 13) check(input_num);
}

function check(input_num) {
	let input_a = document.getElementById('a');
	let input_b = document.getElementById('b');
	let input_c = document.getElementById('c');
	let input_d = document.getElementById('d');
	let integerRatio = document.getElementById('integerRatio');

	let a = parseFloat(input_a.value);
	let b = parseFloat(input_b.value);
	let c = parseFloat(input_c.value);
	let d = parseFloat(input_d.value);

	let filledNum =
		(isEmpty(a) ? 0 : 1) +
		(isEmpty(b) ? 0 : 1) +
		(isEmpty(c) ? 0 : 1) +
		(isEmpty(d) ? 0 : 1);
	if (filledNum >= 3) {
		if (isEmpty(a)) input_a.value = (b * c) / d;
		else if (isEmpty(b)) input_b.value = (a * d) / c;
		else if (isEmpty(c)) input_c.value = (a * d) / b;
		else if (isEmpty(d)) input_d.value = (b * c) / a;
		else {
			switch (input_num) {
				case 1:
					input_b.value = (a * d) / c;
					break;
				case 2:
					input_a.value = (b * c) / d;
					break;
				case 3:
					input_d.value = (b * c) / a;
					break;
				case 4:
					input_c.value = (a * d) / b;
					break;
				default:
					break;
			}
		}
	}

	let detail = '';

	if (!isEmpty(a) && !isEmpty(b)) {
		let mul = Math.max(multNumToInteger(a), multNumToInteger(b));
		a = a * mul;
		b = b * mul;

		let g = gcd(a, b);
		detail += `정수 비 ${a / g} : ${b / g}`;
	}

	integerRatio.textContent = detail;
}
function isEmpty(str) {
	return !str || 0 === str.length;
}

function gcd(a, b) {
	while (b !== 0) {
		let r = a % b;
		a = b;
		b = r;
	}
	return a;
}

function multNumToInteger(num) {
	let reg = /\.[0-9]*/g.exec(`${num}`);
	let point = reg ? reg[0].length - 1 : 0;
	return Math.pow(10, point);
}

export default { keydown, check, isEmpty, gcd, multNumToInteger };
