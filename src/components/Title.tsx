import React from 'react';

export interface TitleProps {
	title: string;
	subTitle: string;
}

export const Title: React.FC<TitleProps> = ({ title, subTitle }) => {
	return (
		<div className="">
			<h2 className="text-2xl font-bold">{title}</h2>
			<h3 className="text-xl">{subTitle}</h3>
		</div>
	);
};
