'use client';

import React from 'react';

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	
	return (
		<footer className="border-t border-border py-12">
			<div className="max-w-4xl mx-auto px-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
					<div className="text-sm text-muted-foreground">
						© {currentYear} Jisub Kim
					</div>
					
					<div className="flex flex-wrap gap-6 text-sm">
						<a 
							href="mailto:0226daniel@gmail.com"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Email
						</a>
						<a 
							href="https://github.com/kimjisub"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							GitHub
						</a>
						<a 
							href="https://www.linkedin.com/in/kimjisub"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							LinkedIn
						</a>
						<a 
							href="https://velog.io/@kimjisub"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Velog
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
