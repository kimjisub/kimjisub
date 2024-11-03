'use client';

import { useState } from 'react';

export default function Home() {
	const [count, setCount] = useState(0);
	return (
		<main className="flex flex-col min-h-screen py-4 snap-y snap-mandatory">
			<br />
			<br />
			<br />
			<button onClick={() => setCount(prev => prev + 1)}>Increment</button>

			{count}
		</main>
	);
}
