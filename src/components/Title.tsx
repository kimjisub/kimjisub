import React from 'react';

export interface TitleProps {
	title: string;
	subTitle: string;
}

export const Title: React.FC<TitleProps> = ({ title, subTitle }) => {
	return (
		<div className="mb-8">
			<h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>
			<p className="text-muted-foreground text-lg">{subTitle}</p>
		</div>
	);
};
