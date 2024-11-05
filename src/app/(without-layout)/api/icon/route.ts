// app/api/svg/route.ts
import { NextResponse } from 'next/server';

export function GET() {
	const svgContent = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      <text x="50" y="55" font-size="20" text-anchor="middle" fill="white">Hi!</text>
    </svg>
  `;

	return new NextResponse(svgContent, {
		headers: {
			'Content-Type': 'image/svg+xml',
		},
	});
}
