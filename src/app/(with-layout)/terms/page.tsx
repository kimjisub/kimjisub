import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Terms of Service',
	description: '김지섭이 운영하는 개인 자동화 에이전트의 서비스 약관.',
	openGraph: {
		title: 'Terms of Service | Jisub Kim',
		description: '개인 자동화 에이전트의 서비스 약관.',
	},
};

const LAST_UPDATED = '2026년 9월 18일';

export default function TermsOfServicePage() {
	return (
		<main className="mx-auto w-full max-w-3xl px-6 py-16">
			<h1 className="text-3xl font-bold">서비스 약관</h1>
			<p className="mt-2 text-sm opacity-70">최종 수정일: {LAST_UPDATED}</p>

			<div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
				<h2>1. 적용 범위</h2>
				<p>
					이 약관은 김지섭(이하 &ldquo;운영자&rdquo;)이 개인 용도로 운영하는 자동화 에이전트
					애플리케이션의 이용에 적용됩니다. 이 애플리케이션은 운영자 본인의 사용을 전제로 만들어진
					비상업적 도구이며, 일반 대중을 대상으로 서비스를 제공하지 않습니다.
				</p>

				<h2>2. 이용 조건</h2>
				<p>
					이용자는 자신의 Google 계정으로 인증하여 이 애플리케이션을 사용합니다. 이용자는 본인
					계정에 대한 접근 권한을 스스로 관리할 책임이 있으며, 관련 법령과 Google의 서비스 약관을
					준수해야 합니다.
				</p>

				<h2>3. 데이터 처리</h2>
				<p>
					이 애플리케이션이 Google 사용자 데이터를 어떻게 다루는지는{' '}
					<a href="/privacy">개인정보처리방침</a>에 따릅니다.
				</p>

				<h2>4. 보증의 부인</h2>
				<p>
					이 애플리케이션은 있는 그대로(as-is) 제공됩니다. 운영자는 이 애플리케이션이 중단 없이
					동작하거나 오류가 없음을 보증하지 않으며, 특정 목적에의 적합성을 보증하지 않습니다.
				</p>

				<h2>5. 책임의 제한</h2>
				<p>
					관련 법령이 허용하는 범위에서, 운영자는 이 애플리케이션의 이용 또는 이용 불능으로
					발생한 직접적·간접적 손해에 대해 책임을 지지 않습니다.
				</p>

				<h2>6. 이용 중단</h2>
				<p>
					이용자는 언제든지 Google 계정 설정에서 접근 권한을 철회하여 이용을 중단할 수 있습니다.
					운영자는 사전 통지 없이 이 애플리케이션의 제공을 중단할 수 있습니다.
				</p>

				<h2>7. 약관의 변경</h2>
				<p>
					이 약관이 변경되는 경우 이 페이지에 수정된 내용과 최종 수정일을 게시합니다.
				</p>

				<h2>8. 문의</h2>
				<p>
					이 약관에 대한 문의는 <a href="mailto:0226daniel@gmail.com">0226daniel@gmail.com</a> 으로
					보내주시기 바랍니다.
				</p>
			</div>
		</main>
	);
}
