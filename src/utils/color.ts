import Color from 'colorjs.io';

export const getContrastColor = (bgColor: string, targetList: string[]) => {
	try {
		const color = new Color(bgColor);
		let bestContrastColor = targetList[0];
		let maxContrast = 0;

		targetList.forEach(target => {
			const contrastRatio = color.contrast(target, 'WCAG21');
			if (contrastRatio > maxContrast) {
				maxContrast = contrastRatio;
				bestContrastColor = target;
			}
		});

		return bestContrastColor;
	} catch (e) {
		console.error(e);
		return targetList[0];
	}
};
