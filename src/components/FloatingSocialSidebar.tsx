'use client';

import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

const socialLinks = [
	{
		name: 'GitHub',
		url: 'https://github.com/kimjisub',
		icon: faGithub,
	},
	{
		name: 'LinkedIn',
		url: 'https://linkedin.com/in/kimjisub',
		icon: faLinkedin,
	},
];

const email = '0226daniel@gmail.com';

export default function FloatingSocialSidebar() {
	return (
		<>
			{/* Left Side - Social Icons */}
			<motion.div
				className="fixed left-6 bottom-0 hidden md:flex flex-col items-center gap-6 z-50 lg:left-10"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.5 }}
			>
				<motion.ul
					className="flex flex-col items-center gap-5"
					initial={{ y: 20 }}
					animate={{ y: 0 }}
					transition={{ delay: 1.2, duration: 0.5 }}
				>
					{socialLinks.map((link, index) => (
						<motion.li
							key={link.name}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
						>
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={link.name}
								className="block p-2 text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all duration-200"
							>
								<FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
							</a>
						</motion.li>
					))}
				</motion.ul>
				<motion.div
					className="w-px h-24 bg-muted-foreground/50"
					initial={{ scaleY: 0 }}
					animate={{ scaleY: 1 }}
					transition={{ delay: 1.5, duration: 0.5 }}
					style={{ transformOrigin: 'top' }}
				/>
			</motion.div>

			{/* Right Side - Email */}
			<motion.div
				className="fixed right-6 bottom-0 hidden md:flex flex-col items-center gap-6 z-50 lg:right-10"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.5 }}
			>
				<motion.a
					href={`mailto:${email}`}
					className="font-mono text-xs tracking-widest text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all duration-200"
					style={{ writingMode: 'vertical-rl' }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.3, duration: 0.3 }}
				>
					{email}
				</motion.a>
				<motion.div
					className="w-px h-24 bg-muted-foreground/50"
					initial={{ scaleY: 0 }}
					animate={{ scaleY: 1 }}
					transition={{ delay: 1.5, duration: 0.5 }}
					style={{ transformOrigin: 'top' }}
				/>
			</motion.div>
		</>
	);
}
