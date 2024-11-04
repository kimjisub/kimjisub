import React from 'react';

import { getContrastColor } from '@/utils/color';

export interface BadgeProps {
	text: string;
	color?: string;
}

const colorMap = {
	default: 'gray',
	red: 'red',
	orange: 'orange',
	yellow: 'yellow',
	green: 'green',
	blue: 'blue',
};

const Badge: React.FC<BadgeProps> = ({ text, color = 'gray' }) => {
	const decodedColor = colorMap[color as keyof typeof colorMap] || color;

	const contrastColor = getContrastColor(decodedColor, ['black', 'white']);

	const badgeStyle = {
		backgroundColor: decodedColor,
		borderRadius: '12px',
		padding: '4px 8px',
		color: contrastColor,
		display: 'inline-block',
		fontSize: '12px',
	};

	return <span style={badgeStyle}>{text}</span>;
};

export default Badge;
