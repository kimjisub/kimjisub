import Link from 'next/link';

export default function NotFoundPage() {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
			<h1 className="font-heading text-6xl font-bold text-foreground mb-4">404</h1>
			<p className="text-lg text-muted-foreground mb-8">페이지를 찾을 수 없습니다.</p>
			<Link 
				href="/"
				className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity cursor-pointer"
			>
				홈으로 돌아가기
			</Link>
		</div>
	);
}
